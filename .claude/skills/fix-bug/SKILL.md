# Fix Bug

Use when fixing a bug or investigating an unknown issue.

## Steps
1. Reproduce: get exact error, stack trace, or behavior description
2. If root cause is unknown: hypothesize 2-3 likely causes, narrow by reading only relevant files (max 5 reads before reassessing)
3. If stuck after 2 hypotheses, ask the user for more context
4. Once root cause is confirmed: write (or find) a test that reproduces the bug
5. Fix the code minimally — no unrelated changes
6. Run `npm test` and verify the failing test now passes
7. List what could regress and suggest guard tests

## Rules
- Never guess — require evidence before fixing
- Read only files relevant to the issue, not broadly
