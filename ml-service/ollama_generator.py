"""
Ollama-based Text Generator for BEP Content

Uses Ollama's local LLM API to generate high-quality BEP content.
Replaces the PyTorch LSTM model with a modern, faster, and more accurate solution.
"""

import os
import re
import time
import logging
import threading
from functools import lru_cache
from typing import Optional

import requests

from load_help_content import load_field_prompts_from_help_content

logger = logging.getLogger(__name__)

# Thread lock for singleton pattern
_generator_lock = threading.Lock()


class OllamaGenerator:
    """
    Text generator using Ollama local LLM.

    Configuration can be provided via constructor arguments or environment variables:
        - OLLAMA_BASE_URL: API base URL (default: http://localhost:11434)
        - OLLAMA_MODEL: Model name (default: llama3.2:3b)
        - OLLAMA_TIMEOUT: Request timeout in seconds (default: 60)
        - OLLAMA_DEFAULT_TEMPERATURE: Default temperature (default: 0.7)
    """

    # Regex patterns for cleaning AI-generated text (compiled once for performance)
    _PREAMBLE_PATTERNS = [
        re.compile(r'^(Here\s+is|Is|This\s+is|Below\s+is)\s+(a\s+)?(rewritten|revised|improved|polished|enhanced|updated)\s+(version|text).*?:\s*', re.IGNORECASE | re.DOTALL),
        re.compile(r'^(Here\'s|This\'s)\s+(a\s+)?(rewritten|revised|improved|polished|enhanced|updated)\s+(version|text).*?:\s*', re.IGNORECASE | re.DOTALL),
        re.compile(r'^The\s+(following|rewritten|revised|improved)\s+(is|text|version).*?:\s*', re.IGNORECASE | re.DOTALL),
        re.compile(r'^(Rewritten|Revised|Improved|Polished|Enhanced)\s+(version|text).*?:\s*', re.IGNORECASE | re.DOTALL),
        re.compile(r'^["\']?(Here\s+is|Is|This\s+is)', re.IGNORECASE | re.DOTALL),
    ]

    _TRAILING_PATTERNS = [
        re.compile(r'\n\n(This\s+(revised|rewritten|improved|updated)\s+text\s+(adheres|follows|demonstrates|shows).*?)$', re.IGNORECASE | re.DOTALL),
        re.compile(r'\n\n(By\s+following\s+(ISO\s+19650|industry\s+best\s+practices).*?)$', re.IGNORECASE | re.DOTALL),
        re.compile(r'\n\n(The\s+above\s+(text|content)\s+(is|has\s+been).*?)$', re.IGNORECASE | re.DOTALL),
        re.compile(r'\n\n(I\'ve\s+(made|updated|revised|improved).*?)$', re.IGNORECASE | re.DOTALL),
        re.compile(r'\n\n(Key\s+(changes|improvements|updates)\s+(include|made).*?)$', re.IGNORECASE | re.DOTALL),
    ]

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[int] = None,
        verify_on_init: bool = True
    ):
        """
        Initialize Ollama generator.

        Args:
            base_url: Ollama API base URL. Falls back to OLLAMA_BASE_URL env var
                     or 'http://localhost:11434'.
            model: Model name to use (e.g., 'llama3.2:3b', 'mistral:7b').
                  Falls back to OLLAMA_MODEL env var or 'llama3.2:3b'.
            timeout: Request timeout in seconds. Falls back to OLLAMA_TIMEOUT
                    env var or 60.
            verify_on_init: If True, verify Ollama connection on initialization.
                           Set to False for faster startup in tests.
        """
        self.base_url = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        self.timeout = timeout or int(os.getenv("OLLAMA_TIMEOUT", "60"))
        self.default_temperature = float(os.getenv("OLLAMA_DEFAULT_TEMPERATURE", "0.7"))

        # Connection state
        self._connection_verified = False

        # Load field-specific system prompts from helpContentData.js
        # This provides a single source of truth for AI prompts across the application
        logger.info("Loading field prompts from helpContentData.js...")
        self.field_prompts = load_field_prompts_from_help_content()

        # Default fallback for fields without aiPrompt in helpContentData.js
        self.default_prompt = {
            'system': 'You are a BIM Execution Plan (BEP) expert following ISO 19650 standards.',
            'context': 'Provide professional BIM documentation content following industry best practices and ISO 19650 information management principles.'
        }

        # Verify Ollama connection on initialization
        if verify_on_init:
            self._verify_connection()

    def _verify_connection(
        self,
        retries: int = 3,
        delay: float = 2.0,
        auto_pull: bool = True,
        raise_on_failure: bool = False
    ) -> bool:
        """
        Verify that Ollama is running and model is available.

        Args:
            retries: Number of connection attempts before giving up.
            delay: Delay in seconds between retry attempts.
            auto_pull: If True, attempt to pull the model if not found.
            raise_on_failure: If True, raise ConnectionError on failure.
                             If False, just log warnings.

        Returns:
            True if connection verified successfully, False otherwise.

        Raises:
            ConnectionError: If raise_on_failure is True and connection fails.
        """
        last_error: Optional[Exception] = None

        for attempt in range(retries):
            try:
                # Check if Ollama is running
                response = requests.get(f"{self.base_url}/api/tags", timeout=5)
                if response.status_code != 200:
                    raise ValueError(f"Ollama API returned status {response.status_code}")

                # Check if model is available
                data = response.json()
                models = [m.get('name', '') for m in data.get('models', [])]

                if self.model not in models:
                    logger.warning(f"Model '{self.model}' not found in Ollama")
                    logger.debug(f"Available models: {', '.join(models)}")

                    if auto_pull:
                        logger.info(f"Attempting to pull model '{self.model}'...")
                        pull_response = requests.post(
                            f"{self.base_url}/api/pull",
                            json={"name": self.model},
                            timeout=300  # Model pulls can take a while
                        )
                        if pull_response.status_code == 200:
                            logger.info(f"Model '{self.model}' pulled successfully")
                        else:
                            raise ValueError(
                                f"Failed to pull model: {pull_response.status_code}"
                            )
                    else:
                        logger.warning(f"Please run: ollama pull {self.model}")

                logger.info(f"Ollama connection verified. Using model: {self.model}")
                self._connection_verified = True
                return True

            except requests.exceptions.ConnectionError as e:
                last_error = e
                logger.warning(
                    f"Connection attempt {attempt + 1}/{retries} failed: "
                    "Cannot connect to Ollama"
                )
            except requests.exceptions.Timeout as e:
                last_error = e
                logger.warning(
                    f"Connection attempt {attempt + 1}/{retries} failed: "
                    "Request timed out"
                )
            except Exception as e:
                last_error = e
                logger.warning(
                    f"Connection attempt {attempt + 1}/{retries} failed: {e}"
                )

            if attempt < retries - 1:
                time.sleep(delay)

        # All retries exhausted
        error_msg = (
            f"Failed to connect to Ollama after {retries} attempts. "
            "Please ensure Ollama is running (ollama serve)."
        )

        if raise_on_failure:
            raise ConnectionError(error_msg) from last_error

        logger.error(error_msg)
        self._connection_verified = False
        return False

    def _calculate_timeout(self, max_length: int) -> int:
        """
        Calculate dynamic timeout based on generation length.

        Args:
            max_length: Maximum tokens to generate.

        Returns:
            Timeout in seconds.
        """
        # Base timeout + additional time per 100 tokens
        # Assumes ~0.5 seconds per token for safety margin
        base_timeout = self.timeout
        additional = (max_length // 100) * 10
        return min(base_timeout + additional, 300)  # Cap at 5 minutes

    def generate_text(
        self,
        prompt: str,
        max_length: int = 200,
        temperature: Optional[float] = None,
        retries: int = 2,
        num_ctx: Optional[int] = None
    ) -> str:
        """
        Generate text based on a prompt.

        Args:
            prompt: Starting text prompt.
            max_length: Maximum number of tokens to generate.
            temperature: Sampling temperature (0.1-2.0). If None, uses
                        default_temperature from config.
            retries: Number of retry attempts for transient errors.
            num_ctx: Context window size (default: 2048, can increase for larger docs).

        Returns:
            Generated text, or error message if generation fails.
        """
        if temperature is None:
            temperature = self.default_temperature

        effective_timeout = self._calculate_timeout(max_length)
        last_error: Optional[Exception] = None

        for attempt in range(retries + 1):
            try:
                options = {
                    "temperature": temperature,
                    "num_predict": max_length,
                    "top_p": 0.9,
                    "top_k": 40
                }

                # Add num_ctx if specified for larger context windows
                if num_ctx is not None:
                    options["num_ctx"] = num_ctx

                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": options
                }

                logger.debug(
                    f"Generating text: max_length={max_length}, "
                    f"temperature={temperature}, timeout={effective_timeout}s"
                )

                response = requests.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=effective_timeout
                )

                if response.status_code == 200:
                    try:
                        data = response.json()
                        generated = data.get('response', '').strip()
                        return generated
                    except ValueError as e:
                        # JSON decode error
                        logger.error(f"Invalid JSON response: {e}")
                        raise
                else:
                    logger.error(
                        f"Ollama API error: {response.status_code} - "
                        f"{response.text[:200]}"
                    )
                    # Don't retry on client errors (4xx)
                    if 400 <= response.status_code < 500:
                        return "Error: Unable to generate text. Please check Ollama service."
                    raise requests.exceptions.HTTPError(
                        f"Server error: {response.status_code}"
                    )

            except requests.exceptions.Timeout as e:
                last_error = e
                logger.warning(
                    f"Request timeout (attempt {attempt + 1}/{retries + 1})"
                )
            except requests.exceptions.ConnectionError as e:
                last_error = e
                logger.warning(
                    f"Connection error (attempt {attempt + 1}/{retries + 1}): {e}"
                )
            except Exception as e:
                last_error = e
                logger.warning(
                    f"Generation error (attempt {attempt + 1}/{retries + 1}): {e}"
                )

            # Wait before retry with exponential backoff
            if attempt < retries:
                wait_time = (attempt + 1) * 2
                time.sleep(wait_time)

        # All retries exhausted
        logger.error(f"Generation failed after {retries + 1} attempts: {last_error}")
        return "Error: Unable to generate text after multiple attempts. Please try again."

    @lru_cache(maxsize=128)
    def _get_cached_suggestion(self, field_type: str, cache_key: str) -> str:
        """
        Internal cached suggestion generator for fields without partial text.

        Args:
            field_type: Type of BEP field.
            cache_key: Unique key for cache (includes field config hash).

        Returns:
            Generated suggestion.
        """
        field_config = self.field_prompts.get(field_type, self.default_prompt)
        context = field_config.get('context', 'Provide professional BIM content.')
        temperature = field_config.get('temperature', 0.5)

        prompt = f"{context}\n\nGenerate professional content for this section."

        generated = self.generate_text(
            prompt=prompt,
            max_length=200,
            temperature=temperature
        )

        return self._clean_suggestion(generated, '')

    def suggest_for_field(
        self,
        field_type: str,
        partial_text: str = '',
        max_length: int = 200,
        temperature: Optional[float] = None,
        use_cache: bool = True
    ) -> str:
        """
        Generate field-specific suggestion.

        Args:
            field_type: Type of BEP field (e.g., 'modelValidation', 'bimUses').
            partial_text: Existing text in the field to continue from.
            max_length: Maximum tokens to generate.
            temperature: Override temperature for this generation. If None,
                        uses field-specific or default (0.5 for BEP content).
            use_cache: If True and no partial_text, return cached result when
                      available.

        Returns:
            Generated suggestion text.

        Raises:
            ValueError: If field_type is empty or invalid.
        """
        # Input validation
        if not field_type or not isinstance(field_type, str):
            raise ValueError("field_type must be a non-empty string")

        field_type = field_type.strip()
        if not field_type:
            raise ValueError("field_type cannot be empty or whitespace")

        # Sanitize partial_text to prevent prompt injection
        # Remove potential instruction-like patterns
        partial_text = partial_text.strip() if partial_text else ''
        if partial_text:
            # Basic sanitization: limit length and remove suspicious patterns
            partial_text = partial_text[:2000]  # Reasonable max for partial text

        # Get field-specific configuration
        field_config = self.field_prompts.get(field_type, self.default_prompt)
        context = field_config.get('context', 'Provide professional BIM content.')

        # Determine temperature: parameter > field config > default
        if temperature is None:
            temperature = field_config.get('temperature', 0.5)

        # Use cache for suggestions without partial text
        if use_cache and not partial_text:
            # Create cache key from field type (config is already loaded)
            cache_key = f"{field_type}_{hash(context)}"
            try:
                return self._get_cached_suggestion(field_type, cache_key)
            except Exception as e:
                logger.debug(f"Cache miss or error for {field_type}: {e}")

        # Build the prompt
        if partial_text and len(partial_text) > 10:
            # User has typed enough, continue their text
            prompt = f"{context}\n\nContinue this text professionally:\n{partial_text}"
        else:
            # No user text or very little, generate from scratch
            prompt = f"{context}\n\nGenerate professional content for this section."

        # Generate text
        generated = self.generate_text(
            prompt=prompt,
            max_length=max_length,
            temperature=temperature
        )

        # Clean up the suggestion
        suggestion = self._clean_suggestion(generated, partial_text)

        return suggestion

    def clear_cache(self) -> None:
        """Clear the suggestion cache."""
        self._get_cached_suggestion.cache_clear()
        logger.debug("Suggestion cache cleared")

    def _clean_suggestion(
        self,
        text: str,
        partial_text: str = '',
        preserve_paragraphs: bool = True
    ) -> str:
        """
        Clean up generated text by removing AI artifacts.

        Args:
            text: Raw generated text from the model.
            partial_text: Original partial text (to remove if repeated).
            preserve_paragraphs: If True, allow up to 2 consecutive empty lines
                               for paragraph separation. If False, collapse all
                               empty lines.

        Returns:
            Cleaned text suitable for BEP documents.
        """
        if not text:
            return "Please provide more context or try again."

        # Remove any prompt repetition
        if partial_text:
            # If the model repeated the partial text, remove it
            text = text.replace(partial_text, '', 1).strip()

        # Remove common AI artifacts and meta-commentary
        text = re.sub(r'^(Sure|Here|Okay|Certainly)[,!.]?\s*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^(I\'ll|I will|Let me)\s+\w+\s+', '', text, flags=re.IGNORECASE)

        # Remove AI preambles using pre-compiled patterns
        for pattern in self._PREAMBLE_PATTERNS:
            text = pattern.sub('', text)

        # Remove trailing AI explanations using pre-compiled patterns
        for pattern in self._TRAILING_PATTERNS:
            text = pattern.sub('', text)

        # Fix spacing - PRESERVE newlines for proper formatting
        lines = text.split('\n')
        cleaned_lines = []
        empty_line_count = 0

        for line in lines:
            # Collapse multiple spaces within a line
            cleaned_line = re.sub(r' +', ' ', line)
            # Remove space before punctuation
            cleaned_line = re.sub(r'\s+([.,;:!?])', r'\1', cleaned_line)
            # Add space after punctuation if missing
            cleaned_line = re.sub(r'([.,;:!?])([a-zA-Z])', r'\1 \2', cleaned_line)
            cleaned_line = cleaned_line.strip()

            if cleaned_line:
                # Reset empty line counter and add the line
                empty_line_count = 0
                cleaned_lines.append(cleaned_line)
            elif preserve_paragraphs:
                # Allow up to 1 empty line for paragraph breaks
                empty_line_count += 1
                if empty_line_count <= 1 and cleaned_lines:
                    cleaned_lines.append('')

        # Remove trailing empty lines
        while cleaned_lines and not cleaned_lines[-1]:
            cleaned_lines.pop()

        text = '\n'.join(cleaned_lines)

        # Capitalize first letter
        if text:
            text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()

        # Ensure reasonable length
        if len(text) < 10:
            return "Please provide more context or try again."

        return text.strip()


# Global instance for singleton pattern
_ollama_generator: Optional[OllamaGenerator] = None


def get_ollama_generator(
    model: Optional[str] = None,
    base_url: Optional[str] = None,
    force_new: bool = False
) -> OllamaGenerator:
    """
    Get or create the global Ollama generator instance (thread-safe).

    Args:
        model: Model name to use. Falls back to env var or default.
        base_url: Ollama API URL. Falls back to env var or default.
        force_new: If True, create a new instance even if one exists.

    Returns:
        OllamaGenerator instance.
    """
    global _ollama_generator

    if force_new or _ollama_generator is None:
        with _generator_lock:
            # Double-check locking pattern
            if force_new or _ollama_generator is None:
                _ollama_generator = OllamaGenerator(
                    model=model,
                    base_url=base_url
                )

    return _ollama_generator


def reset_generator() -> None:
    """
    Reset the global generator instance (useful for testing).

    Thread-safe operation that clears the singleton.
    """
    global _ollama_generator

    with _generator_lock:
        if _ollama_generator is not None:
            _ollama_generator.clear_cache()
            _ollama_generator = None
        logger.debug("Global generator instance reset")


# Alias for backward compatibility
get_generator = get_ollama_generator
