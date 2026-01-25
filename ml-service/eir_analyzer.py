"""
EIR Analyzer Module

Analyzes Exchange Information Requirements (EIR) documents using Ollama LLM
to extract structured information for BIM Execution Plan (BEP) generation.
Follows ISO 19650 standards.
"""

import json
import re
import logging
from typing import Dict, Any, List, Optional, Tuple

from ollama_generator import get_ollama_generator

logger = logging.getLogger(__name__)


# ISO 19650 compliant EIR analysis prompt
EIR_ANALYSIS_PROMPT = """Sei un esperto di ISO 19650 e gestione informativa BIM. Analizza il seguente documento EIR (Exchange Information Requirements) ed estrai le informazioni chiave per la redazione di un BIM Execution Plan (BEP).

IMPORTANTE: Restituisci SOLO un JSON valido senza commenti o testo aggiuntivo.

Struttura JSON richiesta:
{{
  "project_info": {{
    "name": "string o null",
    "description": "string o null",
    "location": "string o null",
    "client": "string o null",
    "project_type": "string o null",
    "estimated_value": "string o null"
  }},
  "bim_objectives": ["lista di obiettivi BIM principali"],
  "information_requirements": {{
    "OIR": ["Organizational Information Requirements"],
    "AIR": ["Asset Information Requirements"],
    "PIR": ["Project Information Requirements"],
    "EIR_specifics": ["requisiti specifici EIR"]
  }},
  "delivery_milestones": [
    {{"phase": "nome fase", "description": "descrizione", "date": "data o null"}}
  ],
  "standards_protocols": {{
    "classification_systems": ["Uniclass 2015", "ecc."],
    "naming_conventions": "descrizione convenzioni o null",
    "file_formats": ["IFC", "PDF", "ecc."],
    "lod_loi_requirements": "requisiti LOD/LOI o null",
    "cad_standards": "standard CAD o null"
  }},
  "cde_requirements": {{
    "platform": "nome piattaforma o null",
    "workflow_states": ["WIP", "Shared", "Published", "Archived"],
    "access_control": "descrizione controllo accessi o null",
    "folder_structure": "struttura cartelle o null"
  }},
  "roles_responsibilities": [
    {{"role": "nome ruolo", "responsibilities": ["lista responsabilita"]}}
  ],
  "software_requirements": ["lista software richiesti"],
  "plain_language_questions": ["domande in linguaggio semplice se presenti"],
  "quality_requirements": {{
    "model_checking": "requisiti verifica modelli o null",
    "clash_detection": "requisiti clash detection o null",
    "validation_procedures": "procedure validazione o null"
  }},
  "handover_requirements": {{
    "cobie_required": true/false,
    "asset_data": "requisiti dati asset o null",
    "documentation": ["lista documentazione richiesta"]
  }},
  "specific_risks": ["rischi o requisiti specifici identificati"],
  "other_requirements": ["altri requisiti non categorizzati"]
}}

Se un campo non e presente nel documento, usa null per stringhe o array vuoto [] per liste.
Estrai informazioni reali dal documento, non inventare dati.

DOCUMENTO EIR DA ANALIZZARE:
{eir_text}

JSON:"""


# Prompt for generating markdown summary
SUMMARY_PROMPT = """Basandoti sull'analisi JSON del documento EIR, genera un riassunto conciso in italiano in formato Markdown.

Il riassunto deve:
1. Essere strutturato con intestazioni chiare (## per sezioni principali)
2. Evidenziare gli obiettivi BIM principali
3. Sintetizzare i requisiti informativi chiave (OIR, AIR, PIR)
4. Elencare le milestone di consegna principali
5. Notare eventuali requisiti critici o non standard
6. Essere lungo massimo 500 parole

Formato richiesto:
## Panoramica Progetto
[breve descrizione]

## Obiettivi BIM
[lista puntata obiettivi principali]

## Requisiti Informativi Chiave
[sintesi OIR/AIR/PIR]

## Milestone di Consegna
[tabella o lista milestone]

## Requisiti Tecnici
[software, formati, standard]

## Note Critiche
[requisiti particolari o rischi]

ANALISI JSON:
{analysis_json}

RIASSUNTO MARKDOWN:"""


# Prompt for field-specific suggestions based on EIR analysis
FIELD_SUGGESTION_PROMPT = """Sei un esperto BIM ISO 19650. Basandoti sull'analisi EIR fornita, genera un suggerimento specifico per il campo "{field_type}" del BEP.

Il suggerimento deve:
- Essere in italiano
- Essere direttamente rilevante per il campo richiesto
- Basarsi sui dati estratti dall'EIR
- Essere pronto per l'inserimento nel BEP (testo formale e professionale)
- Essere lungo tra 50 e 200 parole

ANALISI EIR:
{analysis_json}

TESTO GIA PRESENTE NEL CAMPO (se vuoto, genera da zero):
{partial_text}

CAMPO BEP: {field_type}

SUGGERIMENTO:"""


class EirAnalyzer:
    """
    Analyzes EIR documents using Ollama LLM to extract structured information.
    """

    # Mapping of BEP field types to EIR analysis sections
    FIELD_MAPPING = {
        'projectName': 'project_info.name',
        'projectDescription': 'project_info.description',
        'appointingParty': 'project_info.client',
        'bimGoals': 'bim_objectives',
        'bimObjectives': 'bim_objectives',
        'primaryObjectives': 'bim_objectives',
        'bimUses': 'bim_objectives',
        'projectObjectives': 'bim_objectives',
        'keyMilestones': 'delivery_milestones',
        'informationPurposes': 'information_requirements',
        'projectInformationRequirements': 'information_requirements.PIR',
        'namingConventions': 'standards_protocols.naming_conventions',
        'fileFormats': 'standards_protocols.file_formats',
        'informationFormats': 'standards_protocols.file_formats',
        'bimSoftware': 'software_requirements',
        'softwarePlatforms': 'software_requirements',
        'cdeStrategy': 'cde_requirements',
        'cdePlatforms': 'cde_requirements.platform',
        'workflowStates': 'cde_requirements.workflow_states',
        'classificationSystems': 'standards_protocols.classification_systems',
        'modelValidation': 'quality_requirements.model_checking',
        'qualityAssurance': 'quality_requirements',
        'cobieRequirements': 'handover_requirements',
        'handoverRequirements': 'handover_requirements',
        'informationRisks': 'specific_risks',
    }

    def __init__(self, model: str = None):
        """
        Initialize the EIR analyzer.

        Args:
            model: Ollama model to use (default from environment)
        """
        self.generator = get_ollama_generator(model=model)
        self.model = model or self.generator.model

    def analyze(self, text: str, filename: str = None) -> Tuple[Dict[str, Any], str]:
        """
        Analyze EIR document text and return structured data.

        Args:
            text: Extracted text from EIR document
            filename: Original filename for context

        Returns:
            Tuple of (analysis_json, summary_markdown)
        """
        logger.info(f"Analyzing EIR document: {filename or 'unknown'}")
        logger.info(f"Text length: {len(text)} chars")

        # Check if text needs chunking
        if len(text) > 12000:  # Roughly 3000 tokens
            logger.info("Document is large, using chunked analysis")
            analysis_json = self._analyze_chunked(text)
        else:
            analysis_json = self._analyze_single(text)

        # Generate summary
        summary_markdown = self._generate_summary(analysis_json)

        return analysis_json, summary_markdown

    def _analyze_single(self, text: str) -> Dict[str, Any]:
        """Analyze text in a single pass."""
        prompt = EIR_ANALYSIS_PROMPT.format(eir_text=text[:15000])  # Limit to ~4k tokens

        try:
            response = self.generator.generate_text(
                prompt=prompt,
                max_length=3000,
                temperature=0.3  # Low temperature for structured output
            )

            # Parse JSON from response
            return self._parse_json_response(response)

        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            return self._empty_analysis()

    def _analyze_chunked(self, text: str) -> Dict[str, Any]:
        """Analyze long text in chunks and merge results."""
        from text_extractor import TextExtractor

        extractor = TextExtractor(max_chunk_tokens=3000)
        chunks = extractor.chunk_text(text)

        logger.info(f"Split into {len(chunks)} chunks")

        # Analyze each chunk
        chunk_analyses = []
        for i, chunk in enumerate(chunks):
            logger.info(f"Analyzing chunk {i+1}/{len(chunks)}")
            try:
                analysis = self._analyze_single(chunk)
                chunk_analyses.append(analysis)
            except Exception as e:
                logger.warning(f"Chunk {i+1} analysis failed: {e}")

        # Merge chunk analyses
        return self._merge_analyses(chunk_analyses)

    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON from LLM response, handling common issues."""
        # Clean response
        text = response.strip()

        # Try to find JSON block
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            text = json_match.group()

        # Fix common JSON issues
        text = text.replace("'", '"')  # Single to double quotes
        text = re.sub(r',\s*}', '}', text)  # Trailing commas
        text = re.sub(r',\s*]', ']', text)  # Trailing commas in arrays

        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse error: {e}")
            logger.debug(f"Raw response: {text[:500]}")
            return self._empty_analysis()

    def _merge_analyses(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Merge multiple chunk analyses into one."""
        if not analyses:
            return self._empty_analysis()

        if len(analyses) == 1:
            return analyses[0]

        merged = self._empty_analysis()

        for analysis in analyses:
            # Merge project_info (prefer non-null values)
            if 'project_info' in analysis:
                for key, value in analysis['project_info'].items():
                    if value and not merged['project_info'].get(key):
                        merged['project_info'][key] = value

            # Merge lists (deduplicate)
            for list_key in ['bim_objectives', 'software_requirements',
                            'plain_language_questions', 'specific_risks',
                            'other_requirements']:
                if list_key in analysis and analysis[list_key]:
                    existing = set(merged.get(list_key, []))
                    for item in analysis[list_key]:
                        if item and item not in existing:
                            merged.setdefault(list_key, []).append(item)
                            existing.add(item)

            # Merge delivery_milestones
            if 'delivery_milestones' in analysis:
                existing_phases = {m.get('phase') for m in merged.get('delivery_milestones', [])}
                for milestone in analysis['delivery_milestones']:
                    if milestone.get('phase') not in existing_phases:
                        merged.setdefault('delivery_milestones', []).append(milestone)
                        existing_phases.add(milestone.get('phase'))

            # Merge roles_responsibilities
            if 'roles_responsibilities' in analysis:
                existing_roles = {r.get('role') for r in merged.get('roles_responsibilities', [])}
                for role in analysis['roles_responsibilities']:
                    if role.get('role') not in existing_roles:
                        merged.setdefault('roles_responsibilities', []).append(role)
                        existing_roles.add(role.get('role'))

            # Merge nested dicts
            for dict_key in ['information_requirements', 'standards_protocols',
                            'cde_requirements', 'quality_requirements',
                            'handover_requirements']:
                if dict_key in analysis and analysis[dict_key]:
                    for key, value in analysis[dict_key].items():
                        if value:
                            if isinstance(value, list):
                                existing = set(merged.get(dict_key, {}).get(key, []))
                                for item in value:
                                    if item and item not in existing:
                                        merged.setdefault(dict_key, {}).setdefault(key, []).append(item)
                            elif not merged.get(dict_key, {}).get(key):
                                merged.setdefault(dict_key, {})[key] = value

        return merged

    def _generate_summary(self, analysis_json: Dict[str, Any]) -> str:
        """Generate markdown summary from analysis JSON."""
        prompt = SUMMARY_PROMPT.format(
            analysis_json=json.dumps(analysis_json, indent=2, ensure_ascii=False)
        )

        try:
            summary = self.generator.generate_text(
                prompt=prompt,
                max_length=1500,
                temperature=0.5
            )
            return summary.strip()
        except Exception as e:
            logger.error(f"Summary generation failed: {e}")
            return self._fallback_summary(analysis_json)

    def _fallback_summary(self, analysis: Dict[str, Any]) -> str:
        """Generate a basic summary if LLM fails."""
        parts = ["## Analisi EIR\n"]

        # Project info
        if analysis.get('project_info', {}).get('name'):
            parts.append(f"**Progetto:** {analysis['project_info']['name']}\n")

        # Objectives
        if analysis.get('bim_objectives'):
            parts.append("\n### Obiettivi BIM\n")
            for obj in analysis['bim_objectives'][:5]:
                parts.append(f"- {obj}\n")

        # Milestones
        if analysis.get('delivery_milestones'):
            parts.append("\n### Milestone\n")
            for ms in analysis['delivery_milestones'][:5]:
                parts.append(f"- {ms.get('phase', 'N/A')}: {ms.get('description', '')}\n")

        return ''.join(parts)

    def _empty_analysis(self) -> Dict[str, Any]:
        """Return empty analysis structure."""
        return {
            "project_info": {
                "name": None,
                "description": None,
                "location": None,
                "client": None,
                "project_type": None,
                "estimated_value": None
            },
            "bim_objectives": [],
            "information_requirements": {
                "OIR": [],
                "AIR": [],
                "PIR": [],
                "EIR_specifics": []
            },
            "delivery_milestones": [],
            "standards_protocols": {
                "classification_systems": [],
                "naming_conventions": None,
                "file_formats": [],
                "lod_loi_requirements": None,
                "cad_standards": None
            },
            "cde_requirements": {
                "platform": None,
                "workflow_states": [],
                "access_control": None,
                "folder_structure": None
            },
            "roles_responsibilities": [],
            "software_requirements": [],
            "plain_language_questions": [],
            "quality_requirements": {
                "model_checking": None,
                "clash_detection": None,
                "validation_procedures": None
            },
            "handover_requirements": {
                "cobie_required": False,
                "asset_data": None,
                "documentation": []
            },
            "specific_risks": [],
            "other_requirements": []
        }

    def suggest_for_field(self, analysis_json: Dict[str, Any],
                          field_type: str, partial_text: str = "") -> str:
        """
        Generate a suggestion for a specific BEP field based on EIR analysis.

        Args:
            analysis_json: Parsed EIR analysis
            field_type: BEP field type (e.g., 'bimGoals', 'projectDescription')
            partial_text: Existing text in the field

        Returns:
            Suggested text for the field
        """
        # First try direct extraction from analysis
        direct_value = self._extract_field_value(analysis_json, field_type)
        if direct_value and not partial_text:
            return direct_value

        # Generate suggestion using LLM
        prompt = FIELD_SUGGESTION_PROMPT.format(
            field_type=field_type,
            analysis_json=json.dumps(analysis_json, indent=2, ensure_ascii=False),
            partial_text=partial_text or "(nessun testo)"
        )

        try:
            suggestion = self.generator.generate_text(
                prompt=prompt,
                max_length=500,
                temperature=0.5
            )
            return suggestion.strip()
        except Exception as e:
            logger.error(f"Field suggestion failed: {e}")
            return direct_value or ""

    def _extract_field_value(self, analysis: Dict[str, Any], field_type: str) -> Optional[str]:
        """Extract a value directly from analysis based on field mapping."""
        mapping_path = self.FIELD_MAPPING.get(field_type)
        if not mapping_path:
            return None

        # Navigate the path
        parts = mapping_path.split('.')
        value = analysis

        for part in parts:
            if isinstance(value, dict):
                value = value.get(part)
            else:
                return None

            if value is None:
                return None

        # Convert to string if needed
        if isinstance(value, list):
            return '\n'.join(f"- {item}" for item in value if item)
        elif isinstance(value, str):
            return value

        return None


# Module-level singleton
_analyzer = None


def get_analyzer(model: str = None) -> EirAnalyzer:
    """Get or create the singleton EirAnalyzer instance."""
    global _analyzer
    if _analyzer is None or (model and _analyzer.model != model):
        _analyzer = EirAnalyzer(model=model)
    return _analyzer


if __name__ == "__main__":
    # Test with sample text
    sample_eir = """
    Exchange Information Requirements (EIR)
    Project: New Hospital Building - Phase 2
    Client: NHS Trust

    1. BIM Objectives
    - Improve design coordination through clash detection
    - Enable accurate quantity take-off for cost management
    - Support facility management handover with COBie data

    2. Software Requirements
    - Autodesk Revit 2024 for architectural and structural models
    - Navisworks for coordination
    - BIM 360 for CDE

    3. Delivery Milestones
    - Stage 3 Design: March 2025
    - Stage 4 Technical Design: June 2025
    - Construction: September 2025
    """

    analyzer = EirAnalyzer()
    analysis, summary = analyzer.analyze(sample_eir, "test_eir.pdf")

    print("=== ANALYSIS JSON ===")
    print(json.dumps(analysis, indent=2))
    print("\n=== SUMMARY ===")
    print(summary)
