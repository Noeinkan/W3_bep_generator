"""
EIR Analyzer Module

Analyzes Exchange Information Requirements (EIR) documents using Ollama LLM
to extract structured information for BIM Execution Plan (BEP) generation.
Follows ISO 19650 standards.
"""

import json
import re
import logging
import os
import time
from typing import Dict, Any, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

from pydantic import BaseModel, Field, ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Optional dependencies with graceful fallback
try:
    from json_repair import repair_json
    HAS_JSON_REPAIR = True
except ImportError:
    HAS_JSON_REPAIR = False
    repair_json = None

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False
    fuzz = None

from ollama_generator import get_ollama_generator

logger = logging.getLogger(__name__)


# ============================================================================
# PYDANTIC MODELS FOR VALIDATION
# ============================================================================

class ProjectInfo(BaseModel):
    """Project information from EIR."""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    client: Optional[str] = None
    project_type: Optional[str] = None
    estimated_value: Optional[str] = None


class InformationRequirements(BaseModel):
    """Information requirements categories."""
    OIR: List[str] = Field(default_factory=list)
    AIR: List[str] = Field(default_factory=list)
    PIR: List[str] = Field(default_factory=list)
    EIR_specifics: List[str] = Field(default_factory=list)


class DeliveryMilestone(BaseModel):
    """Single delivery milestone."""
    phase: str
    description: str
    date: Optional[str] = None


class StandardsProtocols(BaseModel):
    """Standards and protocols requirements."""
    classification_systems: List[str] = Field(default_factory=list)
    naming_conventions: Optional[str] = None
    file_formats: List[str] = Field(default_factory=list)
    lod_loi_requirements: Optional[str] = None
    cad_standards: Optional[str] = None


class CdeRequirements(BaseModel):
    """Common Data Environment requirements."""
    platform: Optional[str] = None
    workflow_states: List[str] = Field(default_factory=list)
    access_control: Optional[str] = None
    folder_structure: Optional[str] = None


class RoleResponsibility(BaseModel):
    """Single role and its responsibilities."""
    role: str
    responsibilities: List[str] = Field(default_factory=list)


class QualityRequirements(BaseModel):
    """Quality assurance requirements."""
    model_checking: Optional[str] = None
    clash_detection: Optional[str] = None
    validation_procedures: Optional[str] = None


class HandoverRequirements(BaseModel):
    """Asset handover requirements."""
    cobie_required: bool = False
    asset_data: Optional[str] = None
    documentation: List[str] = Field(default_factory=list)


class EirAnalysis(BaseModel):
    """Complete EIR analysis structure with validation."""
    project_info: ProjectInfo = Field(default_factory=ProjectInfo)
    bim_objectives: List[str] = Field(default_factory=list)
    information_requirements: InformationRequirements = Field(default_factory=InformationRequirements)
    delivery_milestones: List[DeliveryMilestone] = Field(default_factory=list)
    standards_protocols: StandardsProtocols = Field(default_factory=StandardsProtocols)
    cde_requirements: CdeRequirements = Field(default_factory=CdeRequirements)
    roles_responsibilities: List[RoleResponsibility] = Field(default_factory=list)
    software_requirements: List[str] = Field(default_factory=list)
    plain_language_questions: List[str] = Field(default_factory=list)
    quality_requirements: QualityRequirements = Field(default_factory=QualityRequirements)
    handover_requirements: HandoverRequirements = Field(default_factory=HandoverRequirements)
    specific_risks: List[str] = Field(default_factory=list)
    other_requirements: List[str] = Field(default_factory=list)


# ============================================================================
# PROMPTS (Translated to English)
# ============================================================================

# ISO 19650 compliant EIR analysis prompt
EIR_ANALYSIS_PROMPT = """You are an ISO 19650 and BIM information management expert. Analyze the following Exchange Information Requirements (EIR) document and extract the key information needed to draft a BIM Execution Plan (BEP).

IMPORTANT: Return ONLY a valid JSON object with no additional comments or text.
Do NOT include placeholders (e.g., "role name", "phase name", "date or null", "platform name or null"). If information is missing, return null for strings or [] for lists.
Do NOT invent data. Extract only what is explicitly present in the document.

Required JSON structure:
{{
  "project_info": {{
    "name": "string or null",
    "description": "string or null",
    "location": "string or null",
    "client": "string or null",
    "project_type": "string or null",
    "estimated_value": "string or null"
  }},
  "bim_objectives": ["list of main BIM objectives"],
  "information_requirements": {{
    "OIR": ["Organizational Information Requirements"],
    "AIR": ["Asset Information Requirements"],
    "PIR": ["Project Information Requirements"],
    "EIR_specifics": ["specific EIR requirements"]
  }},
  "delivery_milestones": [
    {{"phase": "phase name", "description": "description", "date": "date or null"}}
  ],
  "standards_protocols": {{
    "classification_systems": ["Uniclass 2015", "etc."],
    "naming_conventions": "naming convention description or null",
    "file_formats": ["IFC", "PDF", "etc."],
    "lod_loi_requirements": "LOD/LOI requirements or null",
    "cad_standards": "CAD standards or null"
  }},
  "cde_requirements": {{
    "platform": "platform name or null",
    "workflow_states": ["WIP", "Shared", "Published", "Archived"],
    "access_control": "access control description or null",
    "folder_structure": "folder structure or null"
  }},
  "roles_responsibilities": [
    {{"role": "role name", "responsibilities": ["list of responsibilities"]}}
  ],
  "software_requirements": ["list of required software"],
  "plain_language_questions": ["plain language questions if present"],
  "quality_requirements": {{
    "model_checking": "model checking requirements or null",
    "clash_detection": "clash detection requirements or null",
    "validation_procedures": "validation procedures or null"
  }},
  "handover_requirements": {{
    "cobie_required": true/false,
    "asset_data": "asset data requirements or null",
    "documentation": ["list of required documentation"]
  }},
  "specific_risks": ["identified specific risks or requirements"],
  "other_requirements": ["other uncategorized requirements"]
}}

If a field is not present in the document, use null for strings or empty array [] for lists.
Extract real information from the document - do not invent data.

EIR DOCUMENT TO ANALYZE:
{eir_text}

JSON:"""


# Prompt for generating markdown summary (output in English for BEP)
SUMMARY_PROMPT = """Based on the JSON analysis of the EIR document, generate a concise summary in English in Markdown format.

The summary must:
1. Be structured with clear headings (## for main sections)
2. Highlight the main BIM objectives
3. Synthesize key information requirements (OIR, AIR, PIR)
4. List main delivery milestones
5. Note any critical or non-standard requirements
6. Be maximum 500 words

Required format:
## Project Overview
[brief description]

## BIM Objectives
[bulleted list of main objectives]

## Key Information Requirements
[summary of OIR/AIR/PIR]

## Delivery Milestones
[table or list of milestones]

## Technical Requirements
[software, formats, standards]

## Critical Notes
[particular requirements or risks]

JSON ANALYSIS:
{analysis_json}

ENGLISH MARKDOWN SUMMARY:"""


# Prompt for field-specific suggestions based on EIR analysis (output in English for BEP)
FIELD_SUGGESTION_PROMPT = """You are a BIM ISO 19650 expert. Based on the provided EIR analysis, generate a specific suggestion for the "{field_type}" field of the BEP.

The suggestion must:
- Be in English
- Be directly relevant to the requested field
- Be based on data extracted from the EIR
- Be ready for insertion in the BEP (formal and professional text)
- Be between 50 and 200 words

EIR ANALYSIS:
{analysis_json}

EXISTING TEXT IN FIELD (if empty, generate from scratch):
{partial_text}

BEP FIELD: {field_type}

ENGLISH SUGGESTION:"""


# ============================================================================
# MAIN ANALYZER CLASS
# ============================================================================

class EirAnalyzer:
    """
    Analyzes EIR documents using Ollama LLM to extract structured information.
    """

    # Fuzzy matching thresholds
    FUZZY_THRESHOLD_GENERAL = 85
    FUZZY_THRESHOLD_OBJECTIVES = 80  # More lenient for objectives and requirements

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

    def __init__(self, model: Optional[str] = None):
        """
        Initialize the EIR analyzer.

        Args:
            model: Ollama model to use (default from environment)
        """
        self.generator = get_ollama_generator(model=model)
        self.model = model or self.generator.model
        self.single_pass_char_limit = self._get_env_int(
            "EIR_SINGLE_PASS_CHAR_LIMIT",
            default=30000,
            min_value=12000,
            max_value=50000
        )
        self.chunk_token_limit = self._get_env_int(
            "EIR_CHUNK_TOKENS",
            default=7000,
            min_value=3000,
            max_value=7500
        )
        self.auto_latency_threshold = self._get_env_int(
            "EIR_AUTO_CONCURRENCY_LATENCY",
            default=60,
            min_value=20,
            max_value=180
        )

    @staticmethod
    def _get_env_int(name: str, default: int, min_value: int, max_value: int) -> int:
        value = os.getenv(name)
        if value is None or value == "":
            return default
        try:
            parsed = int(value)
        except ValueError:
            logger.warning(f"Invalid {name} value '{value}', using default {default}")
            return default
        if parsed < min_value:
            logger.warning(f"{name} too low ({parsed}), clamping to {min_value}")
            return min_value
        if parsed > max_value:
            logger.warning(f"{name} too high ({parsed}), clamping to {max_value}")
            return max_value
        return parsed

    def analyze(self, text: str, filename: Optional[str] = None) -> Tuple[Dict[str, Any], str]:
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

        # Check if text needs chunking (increased threshold with larger context window)
        if len(text) > self.single_pass_char_limit:
            logger.info("Document is large, using chunked analysis")
            analysis_json = self._analyze_chunked(text)
        else:
            analysis_json = self._analyze_single(text)

        # Clean low-quality placeholder/gibberish entries
        analysis_json = self._sanitize_analysis(analysis_json)

        # Generate summary
        summary_markdown = self._generate_summary(analysis_json)

        return analysis_json, summary_markdown

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((ConnectionError, TimeoutError, Exception)),
        reraise=True
    )
    def _analyze_single(self, text: str) -> Dict[str, Any]:
        """Analyze text in a single pass with optimized parameters and retry logic."""
        # Use larger text limit with increased context window
        prompt = EIR_ANALYSIS_PROMPT.format(eir_text=text[:self.single_pass_char_limit])

        try:
            response = self.generator.generate_text(
                prompt=prompt,
                max_length=2000,  # Reduced from 3000 - JSON structure rarely needs more
                temperature=0.3,  # Low temperature for structured output
                num_ctx=8192  # Larger context window to handle bigger documents in one pass
            )

            # Parse JSON from response with robust parsing
            return self._parse_json_response(response)

        except (ConnectionError, TimeoutError) as e:
            logger.warning(f"Connection error during analysis, will retry: {e}")
            raise  # Re-raise to trigger retry
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            return self._empty_analysis_dict()

    def _analyze_chunked(self, text: str) -> Dict[str, Any]:
        """Analyze long text in chunks using parallel processing for speed."""
        from text_extractor import TextExtractor

        # Larger chunks with increased context window (8192 tokens ~= 7000 token chunks)
        extractor = TextExtractor(max_chunk_tokens=self.chunk_token_limit)
        chunks = extractor.chunk_text(text)

        logger.info(f"Split into {len(chunks)} chunks for parallel analysis")

        # Dynamic worker count: balance between speed and Ollama capacity
        # Use OLLAMA_MAX_CONCURRENCY env var, or default to min(cpu_count, 6)
        cpu_count = os.cpu_count() or 4
        concurrency_env = os.getenv("OLLAMA_MAX_CONCURRENCY", "").strip().lower()
        auto_mode = concurrency_env in ("", "auto")

        if auto_mode:
            ollama_concurrency = min(cpu_count, 6)
        else:
            try:
                ollama_concurrency = int(concurrency_env)
            except ValueError:
                logger.warning(
                    f"Invalid OLLAMA_MAX_CONCURRENCY '{concurrency_env}', using auto mode"
                )
                ollama_concurrency = min(cpu_count, 6)

        max_workers = min(len(chunks), max(1, min(ollama_concurrency, 6)))

        logger.info(f"Using {max_workers} parallel workers for chunk analysis")

        chunk_analyses: List[Tuple[int, Dict[str, Any]]] = []
        start_index = 0

        # Auto concurrency: sample first chunk to gauge performance
        if auto_mode and len(chunks) > 1:
            sample_start = time.time()
            sample_success = False
            try:
                sample_analysis = self._analyze_single(chunks[0])
                chunk_analyses.append((0, sample_analysis))
                sample_success = True
            except Exception as e:
                logger.warning(f"Sample chunk analysis failed: {e}")
            sample_time = time.time() - sample_start
            if sample_success:
                if sample_time > self.auto_latency_threshold:
                    max_workers = max(1, min(2, max_workers))
                    logger.info(
                        f"Auto concurrency reduced to {max_workers} "
                        f"(sample {sample_time:.1f}s > {self.auto_latency_threshold}s)"
                    )
                else:
                    logger.info(
                        f"Auto concurrency kept at {max_workers} "
                        f"(sample {sample_time:.1f}s)"
                    )
                start_index = 1

        if start_index >= len(chunks):
            analyses_only = [analysis for _, analysis in chunk_analyses]
            return self._merge_analyses(analyses_only)

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all chunks for parallel processing
            future_to_idx = {
                executor.submit(self._analyze_single, chunk): i
                for i, chunk in enumerate(chunks[start_index:], start=start_index)
            }

            # Collect results as they complete
            for future in as_completed(future_to_idx):
                idx = future_to_idx[future]
                try:
                    analysis = future.result()
                    chunk_analyses.append((idx, analysis))
                    logger.info(f"Chunk {idx+1}/{len(chunks)} completed")
                except Exception as e:
                    logger.warning(f"Chunk {idx+1} analysis failed: {e}")

        # Sort by original order before merging
        chunk_analyses.sort(key=lambda x: x[0])
        analyses_only = [analysis for _, analysis in chunk_analyses]

        # Merge chunk analyses
        return self._merge_analyses(analyses_only)

    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON from LLM response with robust error handling."""
        # Clean response
        text = response.strip()

        # Remove markdown code blocks if present
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)

        # Try to find JSON block
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            text = json_match.group()

        # Try json_repair first if available
        if HAS_JSON_REPAIR and repair_json:
            try:
                repaired = repair_json(text)
                data = json.loads(repaired)
                # Validate with Pydantic
                validated = EirAnalysis(**data)
                return validated.model_dump()
            except Exception as e:
                logger.debug(f"json_repair failed: {e}, trying manual fixes")

        # Fallback: manual fixes
        text = text.replace("'", '"')  # Single to double quotes
        text = re.sub(r',\s*}', '}', text)  # Trailing commas in objects
        text = re.sub(r',\s*]', ']', text)  # Trailing commas in arrays

        try:
            data = json.loads(text)
            # Validate with Pydantic - try strict first, then lenient
            try:
                validated = EirAnalysis(**data)
                return validated.model_dump()
            except ValidationError:
                # Try more tolerant validation with type coercion
                try:
                    validated = EirAnalysis.model_validate(data, strict=False)
                    return validated.model_dump()
                except ValidationError as e:
                    logger.warning(f"Pydantic validation error (lenient mode): {e}")
                    # Return raw data as last resort
                    return data
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse error: {e}")
            logger.debug(f"Raw response: {text[:500]}")
            return self._empty_analysis_dict()

    def _merge_analyses(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Merge multiple chunk analyses into one with fuzzy deduplication."""
        if not analyses:
            return self._empty_analysis_dict()

        if len(analyses) == 1:
            return analyses[0]

        merged = self._empty_analysis_dict()

        for analysis in analyses:
            # Merge project_info (prefer non-null values)
            if 'project_info' in analysis:
                for key, value in analysis['project_info'].items():
                    if value and not merged['project_info'].get(key):
                        merged['project_info'][key] = value

            # Merge lists with fuzzy deduplication (adaptive thresholds)
            for list_key in ['bim_objectives', 'software_requirements',
                            'plain_language_questions', 'specific_risks',
                            'other_requirements']:
                if list_key in analysis and analysis[list_key]:
                    merged.setdefault(list_key, [])
                    # Use lower threshold for objectives and requirements (more lenient)
                    threshold = self.FUZZY_THRESHOLD_OBJECTIVES if list_key in ['bim_objectives', 'other_requirements'] else self.FUZZY_THRESHOLD_GENERAL
                    for item in analysis[list_key]:
                        if item and not self._is_duplicate_fuzzy(item, merged[list_key], threshold):
                            merged[list_key].append(item)

            # Merge delivery_milestones
            if 'delivery_milestones' in analysis:
                merged.setdefault('delivery_milestones', [])
                for milestone in analysis['delivery_milestones']:
                    phase = milestone.get('phase', '')
                    if not self._milestone_exists(phase, merged['delivery_milestones']):
                        merged['delivery_milestones'].append(milestone)

            # Merge roles_responsibilities
            if 'roles_responsibilities' in analysis:
                merged.setdefault('roles_responsibilities', [])
                for role in analysis['roles_responsibilities']:
                    role_name = role.get('role', '')
                    if not self._role_exists(role_name, merged['roles_responsibilities']):
                        merged['roles_responsibilities'].append(role)

            # Merge nested dicts
            for dict_key in ['information_requirements', 'standards_protocols',
                            'cde_requirements', 'quality_requirements',
                            'handover_requirements']:
                if dict_key in analysis and analysis[dict_key]:
                    merged.setdefault(dict_key, {})
                    for key, value in analysis[dict_key].items():
                        if value:
                            if isinstance(value, list):
                                merged[dict_key].setdefault(key, [])
                                # Use lower threshold for information requirements
                                threshold = self.FUZZY_THRESHOLD_OBJECTIVES if dict_key == 'information_requirements' else self.FUZZY_THRESHOLD_GENERAL
                                for item in value:
                                    if item and not self._is_duplicate_fuzzy(item, merged[dict_key][key], threshold):
                                        merged[dict_key][key].append(item)
                            elif not merged[dict_key].get(key):
                                merged[dict_key][key] = value

        return self._sanitize_analysis(merged)

    def _sanitize_analysis(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Remove placeholders, gibberish, and empty entries from analysis."""
        try:
            validated = EirAnalysis.model_validate(analysis, strict=False).model_dump()
        except ValidationError:
            validated = EirAnalysis().model_dump()
            for key, value in analysis.items():
                if key in validated:
                    validated[key] = value

        # Project info
        project_info = validated.get('project_info', {})
        for key in list(project_info.keys()):
            project_info[key] = self._clean_string(project_info.get(key))
        validated['project_info'] = project_info

        # List fields
        validated['bim_objectives'] = self._clean_list(validated.get('bim_objectives', []))
        validated['software_requirements'] = self._clean_list(validated.get('software_requirements', []))
        validated['plain_language_questions'] = self._clean_list(validated.get('plain_language_questions', []))
        validated['specific_risks'] = self._clean_list(validated.get('specific_risks', []))
        validated['other_requirements'] = self._clean_list(validated.get('other_requirements', []))

        # Information requirements
        info_req = validated.get('information_requirements', {})
        for key in ['OIR', 'AIR', 'PIR', 'EIR_specifics']:
            info_req[key] = self._clean_list(info_req.get(key, []))
        validated['information_requirements'] = info_req

        # Standards & protocols
        standards = validated.get('standards_protocols', {})
        standards['classification_systems'] = self._clean_list(standards.get('classification_systems', []))
        standards['file_formats'] = self._clean_list(standards.get('file_formats', []))
        standards['naming_conventions'] = self._clean_string(standards.get('naming_conventions'))
        standards['lod_loi_requirements'] = self._clean_string(standards.get('lod_loi_requirements'))
        standards['cad_standards'] = self._clean_string(standards.get('cad_standards'))
        validated['standards_protocols'] = standards

        # CDE requirements
        cde = validated.get('cde_requirements', {})
        cde['platform'] = self._clean_string(cde.get('platform'))
        cde['workflow_states'] = self._clean_list(cde.get('workflow_states', []))
        cde['access_control'] = self._clean_string(cde.get('access_control'))
        cde['folder_structure'] = self._clean_string(cde.get('folder_structure'))
        validated['cde_requirements'] = cde

        # Quality requirements
        quality = validated.get('quality_requirements', {})
        quality['model_checking'] = self._clean_string(quality.get('model_checking'))
        quality['clash_detection'] = self._clean_string(quality.get('clash_detection'))
        quality['validation_procedures'] = self._clean_string(quality.get('validation_procedures'))
        validated['quality_requirements'] = quality

        # Handover requirements
        handover = validated.get('handover_requirements', {})
        handover['asset_data'] = self._clean_string(handover.get('asset_data'))
        handover['documentation'] = self._clean_list(handover.get('documentation', []))
        validated['handover_requirements'] = handover

        # Delivery milestones
        validated['delivery_milestones'] = self._clean_milestones(validated.get('delivery_milestones', []))

        # Roles & responsibilities
        validated['roles_responsibilities'] = self._clean_roles(validated.get('roles_responsibilities', []))

        return validated

    def _clean_string(self, value: Optional[str]) -> Optional[str]:
        """Normalize and validate a string value."""
        if value is None:
            return None
        if not isinstance(value, str):
            value = str(value)
        cleaned = value.strip()
        if not cleaned:
            return None
        if self._is_placeholder_value(cleaned) or self._looks_like_gibberish(cleaned):
            return None
        return cleaned

    def _clean_list(self, items: Any) -> List[str]:
        """Clean list items and deduplicate."""
        if not isinstance(items, list):
            return []
        cleaned_items = []
        seen = set()
        for item in items:
            if not isinstance(item, str):
                item = str(item) if item is not None else ''
            cleaned = self._clean_string(item)
            if not cleaned:
                continue
            key = self._normalize_text(cleaned)
            if key in seen:
                continue
            seen.add(key)
            cleaned_items.append(cleaned)
        return cleaned_items

    def _clean_milestones(self, milestones: Any) -> List[Dict[str, Any]]:
        """Clean milestone entries and drop placeholders."""
        if not isinstance(milestones, list):
            return []
        cleaned = []
        for milestone in milestones:
            if not isinstance(milestone, dict):
                continue
            phase = self._clean_string(milestone.get('phase'))
            description = self._clean_string(milestone.get('description'))
            date = self._clean_string(milestone.get('date'))
            if not phase and not description:
                continue
            cleaned.append({
                'phase': phase or 'N/A',
                'description': description or '',
                'date': date
            })
        return cleaned

    def _clean_roles(self, roles: Any) -> List[Dict[str, Any]]:
        """Clean role entries and remove placeholders."""
        if not isinstance(roles, list):
            return []
        cleaned = []
        for role in roles:
            if not isinstance(role, dict):
                continue
            role_name = self._clean_string(role.get('role'))
            responsibilities = self._clean_list(role.get('responsibilities', []))
            if not role_name:
                continue
            cleaned.append({
                'role': role_name,
                'responsibilities': responsibilities
            })
        return cleaned

    def _normalize_text(self, text: str) -> str:
        """Normalize text for comparisons."""
        return re.sub(r'[\s\-_]+', ' ', text.strip().lower())

    def _is_placeholder_value(self, text: str) -> bool:
        """Detect placeholder or template-like values."""
        normalized = self._normalize_text(text)
        placeholder_values = {
            'role name',
            'list of responsibilities',
            'phase name',
            'description',
            'date or null',
            'platform name or null',
            'naming convention description or null',
            'lod/loi requirements or null',
            'cad standards or null',
            'access control description or null',
            'folder structure or null',
            'list of required software',
            'plain language questions if present',
            'identified specific risks or requirements',
            'other uncategorized requirements',
            'string or null',
            'null',
            'n/a',
            'na',
            '-',
            'not specified',
            'not provided',
            'unknown',
            'tbd'
        }

        if normalized in placeholder_values:
            return True

        if re.search(r'\bor null\b', normalized):
            return True

        if re.fullmatch(r'[-–—]+', text.strip()):
            return True

        if text.strip().isdigit() and len(text.strip()) <= 2:
            return True

        return False

    def _looks_like_gibberish(self, text: str) -> bool:
        """Heuristic detection of low-quality gibberish."""
        stripped = text.strip()
        if len(stripped) < 3:
            return True

        if re.search(r'(.)\1{5,}', stripped):
            return True

        letters = sum(ch.isalpha() for ch in stripped)
        digits = sum(ch.isdigit() for ch in stripped)
        total = max(1, len(stripped))

        if letters == 0 and digits == 0:
            return True

        if letters / total < 0.25 and digits / total < 0.2:
            return True

        return False

    def _is_duplicate_fuzzy(self, item: str, existing_list: List[str], threshold: Optional[int] = None) -> bool:
        """Check if item is a fuzzy duplicate of any item in existing_list."""
        if threshold is None:
            threshold = self.FUZZY_THRESHOLD_GENERAL

        # Handle None or empty items
        if not item or not isinstance(item, str):
            return False

        if not HAS_RAPIDFUZZ or not fuzz:
            # Fallback to exact match
            return item in existing_list

        for existing in existing_list:
            # Skip None or non-string values
            if not existing or not isinstance(existing, str):
                continue
            if fuzz.ratio(item.lower(), existing.lower()) >= threshold:
                return True
        return False

    def _milestone_exists(self, phase: str, milestones: List[Dict[str, Any]]) -> bool:
        """Check if milestone with similar phase already exists."""
        if not phase or not isinstance(phase, str):
            return False
        for m in milestones:
            existing_phase = m.get('phase', '')
            # Skip None or empty values
            if not existing_phase or not isinstance(existing_phase, str):
                continue
            if HAS_RAPIDFUZZ and fuzz:
                if fuzz.ratio(phase.lower(), existing_phase.lower()) >= self.FUZZY_THRESHOLD_GENERAL:
                    return True
            else:
                if phase.lower() == existing_phase.lower():
                    return True
        return False

    def _role_exists(self, role: str, roles: List[Dict[str, Any]]) -> bool:
        """Check if role with similar name already exists."""
        if not role or not isinstance(role, str):
            return False
        for r in roles:
            existing_role = r.get('role', '')
            # Skip None or empty values
            if not existing_role or not isinstance(existing_role, str):
                continue
            if HAS_RAPIDFUZZ and fuzz:
                if fuzz.ratio(role.lower(), existing_role.lower()) >= self.FUZZY_THRESHOLD_GENERAL:
                    return True
            else:
                if role.lower() == existing_role.lower():
                    return True
        return False

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((ConnectionError, TimeoutError, Exception)),
        reraise=True
    )
    def _generate_summary(self, analysis_json: Dict[str, Any]) -> str:
        """Generate markdown summary from analysis JSON with optimized parameters and retry logic."""
        prompt = SUMMARY_PROMPT.format(
            analysis_json=json.dumps(analysis_json, indent=2, ensure_ascii=False)
        )

        try:
            summary = self.generator.generate_text(
                prompt=prompt,
                max_length=800,  # Reduced from 1500 - summaries are concise by nature
                temperature=0.5,
                num_ctx=4096  # Sufficient context for summary generation
            )
            return summary.strip()
        except (ConnectionError, TimeoutError) as e:
            logger.warning(f"Connection error during summary generation, will retry: {e}")
            raise  # Re-raise to trigger retry
        except Exception as e:
            logger.error(f"Summary generation failed: {e}")
            return self._fallback_summary(analysis_json)

    def _fallback_summary(self, analysis: Dict[str, Any]) -> str:
        """Generate a basic summary if LLM fails."""
        parts = ["## EIR Analysis\n"]

        # Project info
        if analysis.get('project_info', {}).get('name'):
            parts.append(f"**Project:** {analysis['project_info']['name']}\n")

        # Objectives
        if analysis.get('bim_objectives'):
            parts.append("\n### BIM Objectives\n")
            for obj in analysis['bim_objectives'][:5]:
                parts.append(f"- {obj}\n")

        # Milestones
        if analysis.get('delivery_milestones'):
            parts.append("\n### Milestones\n")
            for ms in analysis['delivery_milestones'][:5]:
                parts.append(f"- {ms.get('phase', 'N/A')}: {ms.get('description', '')}\n")

        return ''.join(parts)

    def _empty_analysis_dict(self) -> Dict[str, Any]:
        """Return empty analysis structure as dict."""
        return EirAnalysis().model_dump()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((ConnectionError, TimeoutError, Exception)),
        reraise=True
    )
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

        # Generate suggestion using LLM with retry logic
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
        except (ConnectionError, TimeoutError) as e:
            logger.warning(f"Connection error during field suggestion, will retry: {e}")
            raise  # Re-raise to trigger retry
        except Exception as e:
            logger.error(f"Field suggestion failed: {e}")
            return direct_value or ""

    def _extract_field_value(self, analysis: Dict[str, Any], field_type: str) -> Optional[str]:
        """Extract a value directly from analysis based on field mapping with rich composition."""
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

        # Convert to string with rich composition for complex fields
        if isinstance(value, list):
            # Special handling for delivery_milestones
            if field_type == 'keyMilestones' and value and isinstance(value[0], dict):
                lines = []
                for milestone in value:
                    phase = milestone.get('phase', 'N/A')
                    desc = milestone.get('description', '')
                    date = milestone.get('date', '')
                    if date:
                        lines.append(f"- {phase} ({date}): {desc}")
                    else:
                        lines.append(f"- {phase}: {desc}")
                return '\n'.join(lines)

            # Special handling for roles_responsibilities
            if field_type in ['roles', 'rolesResponsibilities'] and value and isinstance(value[0], dict):
                lines = []
                for role in value:
                    role_name = role.get('role', 'N/A')
                    responsibilities = role.get('responsibilities', [])
                    lines.append(f"**{role_name}:**")
                    for resp in responsibilities:
                        lines.append(f"  - {resp}")
                return '\n'.join(lines)

            # Default list handling
            return '\n'.join(f"- {item}" for item in value if item)

        elif isinstance(value, dict):
            # Special handling for informationPurposes - compose OIR/AIR/PIR/EIR_specifics
            if field_type == 'informationPurposes':
                lines = []
                for category in ['OIR', 'AIR', 'PIR', 'EIR_specifics']:
                    items = value.get(category, [])
                    if items:
                        lines.append(f"**{category}:**")
                        for item in items:
                            lines.append(f"  - {item}")
                return '\n'.join(lines) if lines else None

            # Special handling for cdeStrategy - compose all CDE info
            if field_type == 'cdeStrategy':
                lines = []
                if value.get('platform'):
                    lines.append(f"**Platform:** {value['platform']}")
                if value.get('workflow_states'):
                    lines.append(f"**Workflow States:** {', '.join(value['workflow_states'])}")
                if value.get('access_control'):
                    lines.append(f"**Access Control:** {value['access_control']}")
                if value.get('folder_structure'):
                    lines.append(f"**Folder Structure:** {value['folder_structure']}")
                return '\n'.join(lines) if lines else None

            # Special handling for qualityAssurance
            if field_type == 'qualityAssurance':
                lines = []
                if value.get('model_checking'):
                    lines.append(f"**Model Checking:** {value['model_checking']}")
                if value.get('clash_detection'):
                    lines.append(f"**Clash Detection:** {value['clash_detection']}")
                if value.get('validation_procedures'):
                    lines.append(f"**Validation Procedures:** {value['validation_procedures']}")
                return '\n'.join(lines) if lines else None

            # Special handling for handoverRequirements
            if field_type in ['handoverRequirements', 'cobieRequirements']:
                lines = []
                if value.get('cobie_required'):
                    lines.append("**COBie Required:** Yes")
                if value.get('asset_data'):
                    lines.append(f"**Asset Data:** {value['asset_data']}")
                if value.get('documentation'):
                    lines.append("**Documentation:**")
                    for doc in value['documentation']:
                        lines.append(f"  - {doc}")
                return '\n'.join(lines) if lines else None

            # Default dict handling - try to format as key-value pairs
            lines = []
            for k, v in value.items():
                if v:
                    if isinstance(v, list):
                        lines.append(f"**{k}:** {', '.join(str(i) for i in v)}")
                    else:
                        lines.append(f"**{k}:** {v}")
            return '\n'.join(lines) if lines else None

        elif isinstance(value, str):
            return value

        return None


# ============================================================================
# MODULE-LEVEL SINGLETON
# ============================================================================

_analyzer: Optional[EirAnalyzer] = None


def get_analyzer(model: Optional[str] = None) -> EirAnalyzer:
    """Get or create the singleton EirAnalyzer instance."""
    global _analyzer
    normalized_model = model.strip() if isinstance(model, str) else model

    if _analyzer is None:
        _analyzer = EirAnalyzer(model=normalized_model)
        return _analyzer

    if normalized_model is not None and _analyzer.model != normalized_model:
        _analyzer = EirAnalyzer(model=normalized_model)

    return _analyzer


# ============================================================================
# MAIN TEST
# ============================================================================

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
    print(json.dumps(analysis, indent=2, ensure_ascii=False))
    print("\n=== SUMMARY ===")
    print(summary)

    # Test field suggestions
    print("\n=== SUGGESTED BIM GOALS ===")
    print(analyzer.suggest_for_field(analysis, 'bimGoals'))

    print("\n=== SUGGESTED CDE STRATEGY ===")
    print(analyzer.suggest_for_field(analysis, 'cdeStrategy'))

    print("\n=== SUGGESTED KEY MILESTONES ===")
    print(analyzer.suggest_for_field(analysis, 'keyMilestones'))
