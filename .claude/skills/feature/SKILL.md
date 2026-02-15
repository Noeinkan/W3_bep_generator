# Feature

Use when adding a new feature. Enforces scope-first workflow.

## Steps
1. Confirm scope: restate the feature in one sentence and list affected files (max 3 per task)
2. If >3 files, break into sub-tasks and confirm order with user
3. Implement one sub-task at a time
4. After each sub-task, run `npm test`
5. Flag risks: list what could break
6. Do NOT add extras (docs, refactors, deps) unless explicitly asked
