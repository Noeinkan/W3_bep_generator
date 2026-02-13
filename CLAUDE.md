# CLAUDE.md — BEP Generator
React 19 + Express + SQLite for BEP documents. Windows/PowerShell environment.

## Workflow
- Describe approach first, wait for approval
- Break changes >3 files into smaller tasks
- Bug fixes: write failing test first
- Run `npm test` after code changes

## Layout
- Frontend: `src/` (React 19, CRA)
- Backend: `server/` (Express, better-sqlite3)
- ML: `ml-service/` (Python + Ollama)
- Start all: `npm start`

## Conventions
Forms: React Hook Form + Zod (`src/schemas/`). State: Context only. API: `src/services/`. Styles: Tailwind. Tests: Jest.

## Gotchas
- `useFormBuilder()` only works inside `<FormBuilderProvider>`
- better-sqlite3 is sync—no async patterns
- Puppeteer stays server-side only