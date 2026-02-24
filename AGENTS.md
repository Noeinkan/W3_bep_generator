# Agent context — BEP Generator

Use **project rules** in `.cursor/rules/` and the **project index** at `.claude/project-index.md` as primary context. Rules are applied automatically by file scope; the index maps directories, contexts, API routes, schemas, and hooks.

**Always:**
- Read `.claude/project-index.md` before exploring the codebase.
- Run `npm test` after code changes.
- Use Unix shell syntax (bash); no PowerShell.

**Source of truth for workflow and conventions:** `CLAUDE.md` (canonical); Cursor rules are a distilled, scoped subset for the editor.
