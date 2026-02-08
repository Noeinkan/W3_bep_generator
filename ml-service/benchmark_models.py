"""
Model Benchmark Script for BEP Generator

Compares llama3.2:3b, gemma3:4b, and qwen3:4b across the 3 critical tasks:
  1. EIR JSON Analysis (structured JSON output)
  2. Question Generation (JSON array output)
  3. BEP Content Generation (text quality)

Usage:
  cd ml-service
  python benchmark_models.py

Prerequisites:
  - Ollama must be running (ollama serve)
  - Models will be auto-pulled if not present
"""

import json
import os
import re
import sys
import time
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

from ollama_generator import OllamaGenerator
from eir_analyzer import EirAnalyzer, EirAnalysis

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

REPORT_PATH = os.path.join(os.path.dirname(__file__), "benchmark_report.md")

# ── Models to benchmark ─────────────────────────────────────────────────────
MODELS = ["llama3.2:3b", "gemma3:4b", "qwen3:4b"]

# ── Sample EIR document (same as eir_analyzer.py __main__) ──────────────────
SAMPLE_EIR = """
Exchange Information Requirements (EIR)
Project: New Hospital Building - Phase 2
Client: NHS Trust
Location: Manchester, UK
Project Type: Healthcare
Estimated Value: £45 million

1. BIM Objectives
- Improve design coordination through clash detection
- Enable accurate quantity take-off for cost management
- Support facility management handover with COBie data
- Achieve BREEAM Excellent rating through sustainable design analysis

2. Information Requirements
- OIR: Asset performance data for portfolio management
- AIR: Equipment specifications, maintenance schedules, warranty info
- PIR: Design coordination reports, cost estimates, programme updates
- EIR: LOD 300 minimum for all building elements at Stage 4

3. Software Requirements
- Autodesk Revit 2024 for architectural and structural models
- Navisworks for coordination and clash detection
- BIM 360 for Common Data Environment
- Solibri Model Checker for validation

4. Delivery Milestones
- Stage 3 Spatial Coordination: March 2025
- Stage 4 Technical Design: June 2025
- Construction Phase: September 2025
- Practical Completion: December 2026

5. Standards and Protocols
- Classification: Uniclass 2015
- Naming Convention: BS EN ISO 19650-2 compliant
- File Formats: IFC 2x3, PDF, DWG
- LOD/LOI: As per UK BIM Framework

6. CDE Requirements
- Platform: BIM 360 Docs
- Workflow States: WIP, Shared, Published, Archived
- Access Control: Role-based with project administrator oversight
- Folder Structure: Aligned with Uniclass 2015

7. Roles and Responsibilities
- BIM Manager: Overall BIM strategy, model coordination, standards compliance
- Information Manager: CDE administration, document control, access management
- Lead Designer: Design model production, clash resolution coordination

8. Quality Requirements
- Model Checking: Weekly automated checks using Solibri
- Clash Detection: Bi-weekly coordination meetings with clash reports
- Validation: All models validated against EIR before sharing

9. Handover Requirements
- COBie data required for all maintainable assets
- As-built models in IFC format
- O&M manuals linked to asset data
- Training documentation for FM team
"""

# ── Formatting helpers ──────────────────────────────────────────────────────

def header(text: str):
    width = 66
    print()
    print(f"  {'=' * width}")
    print(f"  {text:^{width}}")
    print(f"  {'=' * width}")

def subheader(text: str):
    print(f"\n  {text}")
    print(f"  {'-' * len(text)}")


# ── Test 1: EIR JSON Analysis ──────────────────────────────────────────────

def count_populated_fields(analysis: Dict[str, Any]) -> int:
    """Count how many top-level fields have meaningful data."""
    count = 0
    for key, value in analysis.items():
        if value is None:
            continue
        if isinstance(value, list) and len(value) > 0:
            count += 1
        elif isinstance(value, dict):
            # Check if any sub-values are non-empty
            has_data = any(
                v for v in value.values()
                if v and (not isinstance(v, list) or len(v) > 0)
            )
            if has_data:
                count += 1
        elif isinstance(value, str) and value.strip():
            count += 1
        elif isinstance(value, bool):
            count += 1
    return count


def test_eir_analysis(model: str) -> Dict[str, Any]:
    """Test EIR document analysis with JSON output."""
    result = {
        "json_ok": False,
        "pydantic_ok": False,
        "fields_populated": 0,
        "total_fields": 13,  # number of top-level fields in EirAnalysis
        "time_s": 0.0,
        "error": None,
        "raw_json": None,
    }

    try:
        analyzer = EirAnalyzer(model=model)

        start = time.time()
        analysis_json, _ = analyzer.analyze(SAMPLE_EIR, "benchmark_eir.pdf")
        result["time_s"] = round(time.time() - start, 1)

        # If we got here, JSON parsed OK
        result["json_ok"] = True
        result["raw_json"] = analysis_json

        # Pydantic validation
        try:
            EirAnalysis(**analysis_json)
            result["pydantic_ok"] = True
        except Exception:
            # Try lenient mode
            try:
                EirAnalysis.model_validate(analysis_json, strict=False)
                result["pydantic_ok"] = True
            except Exception:
                pass

        result["fields_populated"] = count_populated_fields(analysis_json)

    except Exception as e:
        result["error"] = str(e)[:100]

    return result


# ── Test 2: Question Generation ────────────────────────────────────────────

def test_question_generation(model: str) -> Dict[str, Any]:
    """Test question generation (JSON array output)."""
    result = {
        "json_ok": False,
        "questions_count": 0,
        "time_s": 0.0,
        "error": None,
        "raw_questions": None,
    }

    try:
        generator = OllamaGenerator(model=model, verify_on_init=False)

        start = time.time()
        questions = generator.generate_questions_for_field(
            field_type="projectDescription",
            field_label="Project Description",
            field_context={"step_name": "Project Information", "step_number": 1}
        )
        result["time_s"] = round(time.time() - start, 1)

        # If we got a list back (even from fallback), check quality
        if isinstance(questions, list):
            result["json_ok"] = True
            result["raw_questions"] = questions
            # Count questions with non-empty text
            valid = [q for q in questions if q.get("text", "").strip()]
            result["questions_count"] = len(valid)

    except Exception as e:
        result["error"] = str(e)[:100]

    return result


# ── Test 3: BEP Content Generation ────────────────────────────────────────

AI_PREAMBLE_PATTERNS = [
    re.compile(r'^(Here\s+is|Here\'s|This\s+is|Below\s+is|Sure|Certainly)', re.IGNORECASE),
    re.compile(r'^(I\'ll|I will|Let me)', re.IGNORECASE),
]

def has_ai_artifacts(text: str) -> bool:
    """Check if text still contains AI preamble artifacts."""
    for pattern in AI_PREAMBLE_PATTERNS:
        if pattern.search(text.strip()):
            return True
    return False


def test_content_generation(model: str) -> Dict[str, Any]:
    """Test BEP content generation (text quality)."""
    result = {
        "length": 0,
        "clean": False,
        "time_s": 0.0,
        "error": None,
        "preview": "",
        "full_text": "",
    }

    try:
        generator = OllamaGenerator(model=model, verify_on_init=False)

        start = time.time()
        text = generator.suggest_for_field(
            field_type="bimObjectives",
            partial_text="",
            max_length=200,
            use_cache=False
        )
        result["time_s"] = round(time.time() - start, 1)

        result["length"] = len(text)
        result["clean"] = not has_ai_artifacts(text)
        result["full_text"] = text
        result["preview"] = text[:120].replace("\n", " ") + ("..." if len(text) > 120 else "")

    except Exception as e:
        result["error"] = str(e)[:100]

    return result


# ── Run all benchmarks ────────────────────────────────────────────────────

def run_benchmark():
    print()
    print("  ╔══════════════════════════════════════════════════════════════╗")
    print("  ║          MODEL BENCHMARK  —  BEP Generator                 ║")
    print("  ╚══════════════════════════════════════════════════════════════╝")

    # Check Ollama is running
    import requests
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=5)
        if resp.status_code != 200:
            print("\n  ERROR: Ollama returned non-200 status. Is it running?")
            sys.exit(1)
    except Exception:
        print("\n  ERROR: Cannot connect to Ollama. Run 'ollama serve' first.")
        sys.exit(1)

    eir_results: Dict[str, Dict] = {}
    question_results: Dict[str, Dict] = {}
    content_results: Dict[str, Dict] = {}

    for model in MODELS:
        header(f"Testing: {model}")

        # Ensure model is available (auto-pull)
        print(f"\n  Initializing {model} (will auto-pull if needed)...")
        try:
            gen = OllamaGenerator(model=model, verify_on_init=True)
            print(f"  Model {model} ready.\n")
        except Exception as e:
            print(f"  FAILED to initialize {model}: {e}")
            print(f"  Try manually: ollama pull {model}")
            eir_results[model] = {"error": str(e)[:80]}
            question_results[model] = {"error": str(e)[:80]}
            content_results[model] = {"error": str(e)[:80]}
            continue

        # Run warm-up generation to load model into memory
        print("  Warm-up pass (loading model into GPU/RAM)...")
        gen.generate_text("Hello", max_length=10, temperature=0.5)
        print("  Warm-up done.\n")

        # Test 1: EIR Analysis
        print("  [1/3] EIR JSON Analysis...")
        eir_results[model] = test_eir_analysis(model)
        r = eir_results[model]
        status = "PASS" if r["json_ok"] and r["pydantic_ok"] else "PARTIAL" if r["json_ok"] else "FAIL"
        print(f"         {status} — JSON:{r['json_ok']} Pydantic:{r['pydantic_ok']} "
              f"Fields:{r['fields_populated']}/{r['total_fields']} Time:{r['time_s']}s")

        # Test 2: Question Generation
        print("  [2/3] Question Generation...")
        question_results[model] = test_question_generation(model)
        r = question_results[model]
        status = "PASS" if r["json_ok"] and r["questions_count"] >= 3 else "PARTIAL" if r["json_ok"] else "FAIL"
        print(f"         {status} — JSON:{r['json_ok']} Questions:{r['questions_count']} Time:{r['time_s']}s")

        # Test 3: Content Generation
        print("  [3/3] BEP Content Generation...")
        content_results[model] = test_content_generation(model)
        r = content_results[model]
        status = "PASS" if r["length"] > 50 and r["clean"] else "PARTIAL" if r["length"] > 50 else "FAIL"
        print(f"         {status} — Length:{r['length']} Clean:{r['clean']} Time:{r['time_s']}s")
        if r.get("preview"):
            print(f"         Preview: {r['preview']}")

    # ── Summary table ──────────────────────────────────────────────────────

    header("RESULTS SUMMARY")

    subheader("Test 1: EIR JSON Analysis (most critical)")
    print(f"  {'Model':<20} {'JSON':>6} {'Pydantic':>10} {'Fields':>8} {'Time':>8}")
    for model in MODELS:
        r = eir_results.get(model, {})
        if r.get("error") and not r.get("json_ok"):
            print(f"  {model:<20} {'ERROR':>6} {'—':>10} {'—':>8} {'—':>8}")
        else:
            fields = f"{r.get('fields_populated', 0)}/{r.get('total_fields', 13)}"
            print(f"  {model:<20} {'OK' if r.get('json_ok') else 'FAIL':>6} "
                  f"{'OK' if r.get('pydantic_ok') else 'FAIL':>10} "
                  f"{fields:>8} {r.get('time_s', 0):>7.1f}s")

    subheader("Test 2: Question Generation (JSON array)")
    print(f"  {'Model':<20} {'JSON':>6} {'Questions':>10} {'Time':>8}")
    for model in MODELS:
        r = question_results.get(model, {})
        if r.get("error") and not r.get("json_ok"):
            print(f"  {model:<20} {'ERROR':>6} {'—':>10} {'—':>8}")
        else:
            print(f"  {model:<20} {'OK' if r.get('json_ok') else 'FAIL':>6} "
                  f"{r.get('questions_count', 0):>10} {r.get('time_s', 0):>7.1f}s")

    subheader("Test 3: BEP Content Generation (text quality)")
    print(f"  {'Model':<20} {'Length':>7} {'Clean':>6} {'Time':>8}")
    for model in MODELS:
        r = content_results.get(model, {})
        if r.get("error") and r.get("length", 0) == 0:
            print(f"  {model:<20} {'ERROR':>7} {'—':>6} {'—':>8}")
        else:
            print(f"  {model:<20} {r.get('length', 0):>7} "
                  f"{'OK' if r.get('clean') else 'DIRTY':>6} {r.get('time_s', 0):>7.1f}s")

    # ── Scoring ────────────────────────────────────────────────────────────

    subheader("Overall Score (JSON reliability 50%, speed 25%, quality 25%)")

    scores: Dict[str, float] = {}
    for model in MODELS:
        eir = eir_results.get(model, {})
        q = question_results.get(model, {})
        c = content_results.get(model, {})

        # JSON reliability (0-50 points)
        json_score = 0.0
        if eir.get("json_ok"):
            json_score += 10
        if eir.get("pydantic_ok"):
            json_score += 15
        json_score += min(15, (eir.get("fields_populated", 0) / 13) * 15)
        if q.get("json_ok"):
            json_score += 5
        if q.get("questions_count", 0) >= 3:
            json_score += 5

        # Speed (0-25 points) — lower is better, normalize against slowest
        all_times = [
            eir_results.get(m, {}).get("time_s", 999)
            + question_results.get(m, {}).get("time_s", 999)
            + content_results.get(m, {}).get("time_s", 999)
            for m in MODELS
        ]
        max_time = max(all_times) if max(all_times) > 0 else 1
        total_time = (
            eir.get("time_s", 999)
            + q.get("time_s", 999)
            + c.get("time_s", 999)
        )
        speed_score = max(0, 25 * (1 - total_time / max_time)) if max_time < 2000 else 0

        # Quality (0-25 points)
        quality_score = 0.0
        if c.get("length", 0) > 100:
            quality_score += 10
        elif c.get("length", 0) > 50:
            quality_score += 5
        if c.get("clean"):
            quality_score += 10
        if eir.get("fields_populated", 0) >= 8:
            quality_score += 5

        total = round(json_score + speed_score + quality_score, 1)
        scores[model] = total
        print(f"  {model:<20} {total:>5.1f}/100  "
              f"(JSON:{json_score:.0f} Speed:{speed_score:.0f} Quality:{quality_score:.0f})")

    # Winner
    if scores:
        winner = max(scores, key=scores.get)
        print(f"\n  >>> RECOMMENDED: {winner} (score: {scores[winner]}/100)")

    # Write full report to markdown file
    write_report(eir_results, question_results, content_results, scores)

    print()
    print("  To switch models, set the OLLAMA_MODEL environment variable:")
    print(f"    $env:OLLAMA_MODEL = \"{winner if scores else 'qwen3:4b'}\"")
    print("  Or update the default in ml-service/ollama_generator.py line 75")
    print()


def write_report(eir_results, question_results, content_results, scores):
    """Write a markdown report with full outputs for side-by-side comparison."""
    lines = []
    lines.append(f"# Model Benchmark Report")
    lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    lines.append(f"Models tested: {', '.join(MODELS)}\n")

    # ── Scores summary ──
    lines.append("## Score Summary\n")
    lines.append("| Model | Score | JSON | Speed | Quality |")
    lines.append("|-------|-------|------|-------|---------|")
    for model in MODELS:
        s = scores.get(model)
        if s is not None:
            lines.append(f"| {model} | **{s}/100** | — | — | — |")
        else:
            lines.append(f"| {model} | N/A | — | — | — |")
    lines.append("")

    # ── Test 1: EIR Analysis ──
    lines.append("---")
    lines.append("## Test 1: EIR JSON Analysis\n")
    for model in MODELS:
        r = eir_results.get(model, {})
        lines.append(f"### {model}")
        lines.append(f"- **JSON OK**: {r.get('json_ok', False)}")
        lines.append(f"- **Pydantic OK**: {r.get('pydantic_ok', False)}")
        lines.append(f"- **Fields populated**: {r.get('fields_populated', 0)}/{r.get('total_fields', 13)}")
        lines.append(f"- **Time**: {r.get('time_s', 0)}s")
        if r.get("error"):
            lines.append(f"- **Error**: {r['error']}")
        lines.append("")
        raw = r.get("raw_json")
        if raw:
            lines.append("<details>")
            lines.append(f"<summary>Full JSON output ({model})</summary>\n")
            lines.append("```json")
            lines.append(json.dumps(raw, indent=2, default=str))
            lines.append("```")
            lines.append("</details>\n")

    # ── Test 2: Questions ──
    lines.append("---")
    lines.append("## Test 2: Question Generation\n")
    for model in MODELS:
        r = question_results.get(model, {})
        lines.append(f"### {model}")
        lines.append(f"- **JSON OK**: {r.get('json_ok', False)}")
        lines.append(f"- **Questions count**: {r.get('questions_count', 0)}")
        lines.append(f"- **Time**: {r.get('time_s', 0)}s")
        if r.get("error"):
            lines.append(f"- **Error**: {r['error']}")
        lines.append("")
        raw = r.get("raw_questions")
        if raw:
            lines.append("**Generated questions:**\n")
            for i, q in enumerate(raw, 1):
                text = q.get("text", "(empty)")
                qtype = q.get("type", "?")
                lines.append(f"{i}. [{qtype}] {text}")
            lines.append("")

    # ── Test 3: Content ──
    lines.append("---")
    lines.append("## Test 3: BEP Content Generation (field: bimObjectives)\n")
    for model in MODELS:
        r = content_results.get(model, {})
        lines.append(f"### {model}")
        lines.append(f"- **Length**: {r.get('length', 0)} chars")
        lines.append(f"- **Clean** (no AI preamble): {r.get('clean', False)}")
        lines.append(f"- **Time**: {r.get('time_s', 0)}s")
        if r.get("error"):
            lines.append(f"- **Error**: {r['error']}")
        lines.append("")
        full = r.get("full_text", "")
        if full:
            lines.append("**Full generated text:**\n")
            lines.append("```")
            lines.append(full)
            lines.append("```\n")

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"\n  Report saved to: {REPORT_PATH}")


if __name__ == "__main__":
    run_benchmark()
