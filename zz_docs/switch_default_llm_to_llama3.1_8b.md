# Switch default LLM from llama3.2:3b to llama3.1:8b

## Scope

- **Change:** Default/fallback model string in 5 files only.
- **Unchanged:** README/docs, `ml-service/benchmark_models.py`, timeout logic, and any other references (e.g. `verify_ollama.py`, `start-ollama.js`) — per your spec.

## Files to edit (5)


| #   | File                                                                         | Change                                                                                                                         |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [ml-service/ollama_generator.py](ml-service/ollama_generator.py)             | Line 100: runtime default `"llama3.2:3b"` → `"llama3.1:8b"`. Lines 57 and 92–93: docstring text `llama3.2:3b` → `llama3.1:8b`. |
| 2   | [ml-service/api_ollama.py](ml-service/api_ollama.py)                         | Line 27: `os.getenv('OLLAMA_MODEL', 'llama3.2:3b')` → `'llama3.1:8b'`.                                                         |
| 3   | [src/components/pages/SettingsPage.js](src/components/pages/SettingsPage.js) | Line 6: `DEFAULT_MODEL = 'llama3.2:3b'` → `'llama3.1:8b'`.                                                                     |
| 4   | [docker-compose.yml](docker-compose.yml)                                     | Line 30: `${OLLAMA_MODEL:-llama3.2:3b}` → `${OLLAMA_MODEL:-llama3.1:8b}`.                                                      |
| 5   | [.env.production](.env.production)                                           | Line 5: `OLLAMA_MODEL=llama3.2:3b` → `OLLAMA_MODEL=llama3.1:8b`.                                                               |


(Note: `.env.production` is gitignored; update locally or in deployment env; the plan still includes it so the default in repo/example is consistent if you track it elsewhere.)

## Pre-flight (manual)

Before restarting the ML service, pull the model so the first request is not slow:

```bash
ollama pull llama3.1:8b
```

(~4.7 GB). If skipped, `_verify_connection` in the ML service will trigger pull on first use.

## Verification

1. **Pull:** `ollama pull llama3.1:8b` completes.
2. **Start:** `npm start` — ML service logs e.g. `Ollama connection verified. Using model: llama3.1:8b`.
3. **AI flow:** BEP form → any AI suggestion button → response generates.
4. **UI:** Settings → AI model dropdown shows `llama3.1:8b` as default.

## Optional (not in scope)

- [.claude/project-index.md](.claude/project-index.md) line 60 documents the default as `llama3.2:3b`; can be updated to `llama3.1:8b` for consistency with the codebase.
