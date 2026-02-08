"""
FastAPI service for BEP text generation using Ollama

Provides REST API endpoints for AI-assisted text generation in BEP documents.
Uses Ollama's local LLM for high-quality, fast text generation.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import logging
import os
import tempfile

from ollama_generator import get_ollama_generator
from text_extractor import get_extractor
from eir_analyzer import get_analyzer

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get model and base URL from environment or use defaults
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2:3b')
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')

# Create FastAPI app
app = FastAPI(
    title="BEP AI Text Generator (Ollama)",
    description="AI-powered text generation for BIM Execution Plans using Ollama local LLM",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    """Request model for text generation"""
    prompt: str = Field(..., description="Starting text prompt")
    field_type: Optional[str] = Field(None, description="Type of BEP field")
    max_length: int = Field(200, ge=50, le=1000, description="Maximum characters to generate")
    temperature: float = Field(0.7, ge=0.1, le=2.0, description="Sampling temperature")


class GenerateResponse(BaseModel):
    """Response model for text generation"""
    text: str = Field(..., description="Generated text")
    prompt_used: str = Field(..., description="Actual prompt used for generation")
    model: str = Field(..., description="Model used for generation")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    ollama_connected: bool
    model: str
    backend: str


# Initialize generator on startup
@app.on_event("startup")
async def startup_event():
    """Initialize Ollama connection on startup"""
    try:
        logger.info(f"Initializing Ollama generator with model: {OLLAMA_MODEL}")
        generator = get_ollama_generator(model=OLLAMA_MODEL)
        logger.info("Ollama generator initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Ollama: {e}")
        logger.error("Make sure Ollama is running: ollama serve")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "BEP AI Text Generator API (Ollama Backend)",
        "version": "2.0.0",
        "backend": "Ollama",
        "model": OLLAMA_MODEL,
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        import requests
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        ollama_connected = response.status_code == 200

        return HealthResponse(
            status="healthy" if ollama_connected else "degraded",
            ollama_connected=ollama_connected,
            model=OLLAMA_MODEL,
            backend="Ollama"
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            ollama_connected=False,
            model=OLLAMA_MODEL,
            backend="Ollama"
        )


@app.post("/generate", response_model=GenerateResponse, tags=["Generation"])
async def generate_text(request: GenerateRequest):
    """
    Generate text based on a prompt

    This endpoint uses Ollama's local LLM to generate contextually appropriate
    text for BIM Execution Plan documents.

    - **prompt**: Starting text to continue from
    - **field_type**: Optional field type for context-specific generation
    - **max_length**: Maximum characters to generate (50-1000)
    - **temperature**: Sampling temperature (0.1-2.0, higher = more creative)
    """
    try:
        generator = get_ollama_generator(model=OLLAMA_MODEL)

        # Generate text
        if request.field_type:
            # Use field-specific generation
            generated = generator.suggest_for_field(
                field_type=request.field_type,
                partial_text=request.prompt,
                max_length=request.max_length
            )
            prompt_used = request.prompt
        else:
            # Use generic prompt-based generation
            generated = generator.generate_text(
                prompt=request.prompt,
                max_length=request.max_length,
                temperature=request.temperature
            )
            prompt_used = request.prompt

        logger.info(f"Generated {len(generated)} characters for field_type: {request.field_type}")

        return GenerateResponse(
            text=generated.strip(),
            prompt_used=prompt_used,
            model=OLLAMA_MODEL
        )

    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Text generation failed: {str(e)}"
        )


class SuggestRequest(BaseModel):
    """Request model for field suggestions"""
    field_type: str = Field(..., description="Type of BEP field")
    partial_text: str = Field("", description="Existing text in the field")
    max_length: int = Field(200, ge=50, le=1000, description="Maximum characters to generate")


@app.post("/suggest", response_model=GenerateResponse, tags=["Generation"])
async def suggest_for_field(request: SuggestRequest):
    """
    Generate field-specific suggestions

    Provides context-aware text suggestions for specific BEP fields.
    This endpoint is optimized for inline text completion in the BEP editor.

    - **field_type**: Type of field (e.g., 'executiveSummary', 'projectObjectives')
    - **partial_text**: Any text the user has already typed
    - **max_length**: Maximum characters to generate
    """
    try:
        generator = get_ollama_generator(model=OLLAMA_MODEL)

        # Generate field-specific suggestion
        suggestion = generator.suggest_for_field(
            field_type=request.field_type,
            partial_text=request.partial_text,
            max_length=request.max_length
        )

        logger.info(f"Generated suggestion for {request.field_type}: {len(suggestion)} chars")

        return GenerateResponse(
            text=suggestion,
            prompt_used=request.partial_text,
            model=OLLAMA_MODEL
        )

    except Exception as e:
        logger.error(f"Suggestion error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Suggestion generation failed: {str(e)}"
        )


@app.get("/models", tags=["Models"])
async def list_models():
    """List available Ollama models"""
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=5)

        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])
            return {
                "current_model": OLLAMA_MODEL,
                "available_models": [m.get('name') for m in models],
                "models_detail": models
            }
        else:
            raise HTTPException(status_code=503, detail="Cannot connect to Ollama")

    except Exception as e:
        logger.error(f"Error listing models: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# EIR Document Analysis Endpoints
# ============================================================================

class ExtractTextResponse(BaseModel):
    """Response model for text extraction"""
    text: str = Field(..., description="Extracted text content")
    pages: int = Field(..., description="Number of pages (estimated for DOCX)")
    word_count: int = Field(..., description="Word count")
    char_count: int = Field(..., description="Character count")
    tables_found: int = Field(0, description="Number of tables found")


@app.post("/extract-text", response_model=ExtractTextResponse, tags=["EIR Analysis"])
async def extract_text(file: UploadFile = File(...)):
    """
    Extract text from a PDF or DOCX document.

    Supports:
    - PDF files (using pdfplumber)
    - DOCX files (using python-docx)

    Returns the full text content along with metadata about the document.
    """
    try:
        # Validate file type
        filename = file.filename or "document"
        ext = os.path.splitext(filename)[1].lower()

        if ext not in {'.pdf', '.docx', '.doc'}:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {ext}. Supported: .pdf, .docx"
            )

        # Read file content
        file_bytes = await file.read()

        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")

        if len(file_bytes) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(status_code=413, detail="File too large (max 50MB)")

        # Extract text
        extractor = get_extractor()
        text, metadata = extractor.extract(file_bytes=file_bytes, filename=filename)

        logger.info(f"Extracted {metadata.get('word_count', 0)} words from {filename}")

        return ExtractTextResponse(
            text=text,
            pages=metadata.get('pages', 1),
            word_count=metadata.get('word_count', 0),
            char_count=metadata.get('char_count', len(text)),
            tables_found=metadata.get('tables_found', 0)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text extraction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Text extraction failed: {str(e)}"
        )


class AnalyzeEirRequest(BaseModel):
    """Request model for EIR analysis"""
    text: str = Field(..., description="Extracted text from EIR document")
    filename: Optional[str] = Field(None, description="Original filename for context")


class AnalyzeEirResponse(BaseModel):
    """Response model for EIR analysis"""
    analysis_json: Dict[str, Any] = Field(..., description="Structured analysis JSON")
    summary_markdown: str = Field(..., description="Markdown summary of the analysis")
    model: str = Field(..., description="Model used for analysis")


@app.post("/analyze-eir", response_model=AnalyzeEirResponse, tags=["EIR Analysis"])
async def analyze_eir(request: AnalyzeEirRequest):
    """
    Analyze an EIR document text using AI.

    Extracts structured information according to ISO 19650 standards:
    - Project information
    - BIM objectives
    - Information requirements (OIR, AIR, PIR)
    - Delivery milestones
    - Standards and protocols
    - CDE requirements
    - Roles and responsibilities
    - Software requirements
    - And more...

    Returns both a structured JSON analysis and a markdown summary.
    """
    try:
        if not request.text or len(request.text.strip()) < 100:
            raise HTTPException(
                status_code=400,
                detail="Text too short for meaningful analysis (min 100 chars)"
            )

        logger.info(f"Starting EIR analysis for: {request.filename or 'unknown'}, text length: {len(request.text)} chars")

        analyzer = get_analyzer(model=OLLAMA_MODEL)
        analysis_json, summary_markdown = analyzer.analyze(
            text=request.text,
            filename=request.filename
        )

        logger.info(f"Successfully analyzed EIR document: {request.filename or 'unknown'}")

        return AnalyzeEirResponse(
            analysis_json=analysis_json,
            summary_markdown=summary_markdown,
            model=OLLAMA_MODEL
        )

    except HTTPException:
        raise
    except ConnectionError as e:
        logger.error(f"Ollama connection error during EIR analysis: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to Ollama. Please ensure Ollama is running (ollama serve). Error: {str(e)}"
        )
    except TimeoutError as e:
        logger.error(f"Timeout during EIR analysis: {e}")
        raise HTTPException(
            status_code=504,
            detail=f"Analysis timed out. The document may be too large or complex. Try simplifying it. Error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"EIR analysis error: {e}", exc_info=True)
        error_type = type(e).__name__
        raise HTTPException(
            status_code=500,
            detail=f"EIR analysis failed ({error_type}): {str(e)}"
        )


class SuggestFromEirRequest(BaseModel):
    """Request model for EIR-based field suggestions"""
    analysis_json: Dict[str, Any] = Field(..., description="EIR analysis JSON")
    field_type: str = Field(..., description="BEP field type to get suggestion for")
    partial_text: str = Field("", description="Existing text in the field")


class SuggestFromEirResponse(BaseModel):
    """Response model for EIR-based suggestions"""
    suggestion: str = Field(..., description="Suggested text for the field")
    field_type: str = Field(..., description="Field type")
    model: str = Field(..., description="Model used")


# ============================================================================
# Guided AI Question-based Generation Endpoints
# ============================================================================

class FieldContext(BaseModel):
    """Context about the field being edited"""
    step_name: Optional[str] = Field(None, description="Current step name")
    step_number: Optional[int] = Field(None, description="Current step number")
    existing_fields: Optional[Dict[str, Any]] = Field(None, description="Other filled fields in the same step")
    draft_id: Optional[int] = Field(None, description="Draft ID for additional context")


class GenerateQuestionsRequest(BaseModel):
    """Request model for generating guided questions"""
    field_type: str = Field(..., description="Type of BEP field")
    field_label: str = Field(..., description="Human-readable field label")
    field_context: Optional[FieldContext] = Field(None, description="Field context information")
    help_content: Optional[Dict[str, Any]] = Field(None, description="Help content with ISO 19650, best practices, examples, and common mistakes")


class QuestionItem(BaseModel):
    """A single question for the wizard"""
    id: str = Field(..., description="Question identifier")
    text: str = Field(..., description="Question text")
    hint: str = Field("", description="Optional hint for the user")


class GenerateQuestionsResponse(BaseModel):
    """Response model for generated questions"""
    success: bool = True
    questions: list = Field(..., description="List of questions")
    field_type: str = Field(..., description="Field type")


class AnswerItem(BaseModel):
    """A single answer to a question"""
    question_id: str = Field(..., description="Question identifier")
    question_text: str = Field(..., description="Original question text")
    answer: Optional[str] = Field(None, description="User's answer (None if skipped)")


class GenerateFromAnswersRequest(BaseModel):
    """Request model for generating content from answers"""
    field_type: str = Field(..., description="Type of BEP field")
    field_label: Optional[str] = Field(None, description="Human-readable field label")
    session_id: Optional[str] = Field(None, description="Session identifier")
    answers: list = Field(..., description="List of answer objects")
    field_context: Optional[FieldContext] = Field(None, description="Field context information")


class GenerateFromAnswersResponse(BaseModel):
    """Response model for content generated from answers"""
    success: bool = True
    text: str = Field(..., description="Generated text content")
    questions_answered: int = Field(..., description="Number of questions answered")
    questions_total: int = Field(..., description="Total number of questions")
    model: str = Field(..., description="Model used for generation")


@app.post("/generate-questions", response_model=GenerateQuestionsResponse, tags=["Guided AI"])
async def generate_questions(request: GenerateQuestionsRequest):
    """
    Generate contextual questions for a BEP field.

    The AI generates 3-5 specific questions to help the user provide information
    that will be used to generate more accurate, project-specific BEP content.
    """
    try:
        generator = get_ollama_generator(model=OLLAMA_MODEL)

        field_context_dict = None
        if request.field_context:
            field_context_dict = request.field_context.dict()

        help_content_dict = None
        if request.help_content:
            help_content_dict = request.help_content

        questions = generator.generate_questions_for_field(
            field_type=request.field_type,
            field_label=request.field_label,
            field_context=field_context_dict,
            help_content=help_content_dict
        )

        logger.info(f"Generated {len(questions)} questions for field: {request.field_type}{' (with guidelines)' if help_content_dict else ''}")

        return GenerateQuestionsResponse(
            success=True,
            questions=questions,
            field_type=request.field_type
        )

    except Exception as e:
        logger.error(f"Question generation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Question generation failed: {str(e)}"
        )


@app.post("/generate-from-answers", response_model=GenerateFromAnswersResponse, tags=["Guided AI"])
async def generate_from_answers(request: GenerateFromAnswersRequest):
    """
    Generate BEP content incorporating user answers to guided questions.

    Takes the user's answers from the question wizard and generates professional
    BEP content that naturally incorporates the provided information.
    """
    try:
        generator = get_ollama_generator(model=OLLAMA_MODEL)

        field_context_dict = None
        if request.field_context:
            field_context_dict = request.field_context.dict()

        # Convert answers to plain dicts
        answers_list = []
        for a in request.answers:
            if isinstance(a, dict):
                answers_list.append(a)
            else:
                answers_list.append(a.dict() if hasattr(a, 'dict') else dict(a))

        text = generator.generate_from_answers(
            field_type=request.field_type,
            answers=answers_list,
            field_context=field_context_dict,
            field_label=request.field_label
        )

        questions_answered = sum(1 for a in answers_list if a.get('answer'))
        questions_total = len(answers_list)

        logger.info(
            f"Generated content from {questions_answered}/{questions_total} answers "
            f"for field: {request.field_type}"
        )

        return GenerateFromAnswersResponse(
            success=True,
            text=text,
            questions_answered=questions_answered,
            questions_total=questions_total,
            model=OLLAMA_MODEL
        )

    except Exception as e:
        logger.error(f"Answer-based generation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Content generation failed: {str(e)}"
        )


@app.post("/suggest-from-eir", response_model=SuggestFromEirResponse, tags=["EIR Analysis"])
async def suggest_from_eir(request: SuggestFromEirRequest):
    """
    Generate a suggestion for a BEP field based on EIR analysis.

    Uses the structured EIR analysis to generate contextually appropriate
    suggestions for specific BEP fields like:
    - bimGoals, bimObjectives
    - projectDescription
    - namingConventions
    - cdeStrategy
    - And more...

    The suggestion is tailored to the specific field and incorporates
    information extracted from the client's EIR document.
    """
    try:
        analyzer = get_analyzer(model=OLLAMA_MODEL)
        suggestion = analyzer.suggest_for_field(
            analysis_json=request.analysis_json,
            field_type=request.field_type,
            partial_text=request.partial_text
        )

        logger.info(f"Generated EIR-based suggestion for {request.field_type}")

        return SuggestFromEirResponse(
            suggestion=suggestion,
            field_type=request.field_type,
            model=OLLAMA_MODEL
        )

    except Exception as e:
        logger.error(f"EIR suggestion error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Suggestion generation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    # Run the API server
    print("="*70)
    print(">> BEP AI Text Generator API (Ollama Backend)")
    print("="*70)
    print(f"Model: {OLLAMA_MODEL}")
    print("API: http://localhost:8000")
    print("Docs: http://localhost:8000/docs")
    print("="*70)
    print()
    print("Make sure Ollama is running:")
    print(f"   1. Check: http://localhost:11434/api/tags")
    print(f"   2. Model installed: ollama list")
    print(f"   3. Pull if needed: ollama pull {OLLAMA_MODEL}")
    print("="*70)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
