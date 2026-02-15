# Optimize

Use when improving performance. Enforces measure-first workflow.

## Steps
1. Identify the bottleneck: ask user for symptoms (slow load, lag, large bundle)
2. Measure: profile or inspect the specific area (component re-renders, query count, bundle size)
3. Propose fix with expected impact — get user approval before changing
4. Implement the smallest change that addresses the bottleneck
5. Re-measure to confirm improvement
6. Run `npm test` — zero regressions

## Rules
- Never optimize without measuring first
- One optimization per pass — don't bundle unrelated changes
- Prefer platform/framework built-ins (React.memo, useMemo, indexes) over custom solutions
