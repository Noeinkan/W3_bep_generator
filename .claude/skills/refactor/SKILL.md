# Refactor

Use when restructuring code without changing behavior.

## Steps
1. State the goal (e.g., extract component, rename, simplify)
2. Confirm scope with user — list files to touch
3. Run `npm test` before any changes (baseline)
4. Make changes in small, verifiable increments
5. Run `npm test` after each increment — zero regressions allowed
6. Summarize before/after diff concisely
