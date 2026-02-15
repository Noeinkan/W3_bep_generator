# Continuation Kickoff

Use when starting a new chat and you need a clean, reusable kickoff prompt that hands off remaining work clearly.

## Goal
Create a concise, copy-paste prompt that transfers context, unfinished tasks, constraints, and validation requirements without project-specific assumptions.

## Steps
1. Summarize current status in 3 sections:
   - Completed
   - Remaining
   - Risks/unknowns
2. Define immediate next action (the single first task to execute).
3. List execution rules:
   - scope boundaries
   - fallback/compatibility requirements (if any)
   - reporting format after each task
4. List validation commands and success criteria.
5. Add optional follow-up tasks clearly marked as optional.
6. Output a plain-text kickoff prompt ready to paste into a new chat.

## Rules
- Keep it tool-agnostic and project-agnostic by default.
- Use placeholders for paths, commands, modules, and step names.
- Prefer checklist-like structure over long prose.
- Do not include hidden assumptions; state constraints explicitly.
- Ensure the first task is actionable without further clarification.

## Output template
Use this structure when generating a kickoff prompt:

Project: <project_name>

Context
- Goal: <goal>
- Completed: <what_is_done>
- Remaining: <what_is_left>
- Constraints: <must_not_break / scope rules>

What to do now
1. <first task>
2. <repeat pattern for remaining tasks>

After each task, report
- Changes made
- Files touched
- Validation result

Validation
- Run: <validation_command_1>
- Run: <validation_command_2>
- Success criteria: <expected_result>

Optional follow-ups
- <optional_task_1>
- <optional_task_2>
