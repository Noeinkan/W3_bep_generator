"""
FastAPI service for BEP text generation using Ollama

Provides REST API endpoints for AI-assisted text generation in BEP documents.
Uses Ollama's local LLM for high-quality, fast text generation.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import logging
import os

from ollama_generator import get_ollama_generator

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
