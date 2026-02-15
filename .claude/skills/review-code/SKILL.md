# Review Code

Use when reviewing code for quality. Produces a structured checklist, not prose.

## Output format
Return a markdown checklist covering:
- [ ] **Security**: injection, XSS, auth gaps, secrets in code
- [ ] **Performance**: unnecessary re-renders, N+1 queries, large bundles
- [ ] **Correctness**: edge cases, error handling at boundaries, race conditions
- [ ] **Style**: matches project conventions (Tailwind, RHF+Zod, Context)
- [ ] **Simplicity**: over-engineering, dead code, premature abstraction

## Rules
- Read only the files under review — do not explore unrelated code
- One line per finding, with file:line reference
- Skip categories with no issues rather than writing "looks good"
