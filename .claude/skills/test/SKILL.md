# Test

Use when writing tests for a module or component.

## Steps
1. Read the target file to understand its API/props/behavior
2. Identify test cases: happy path, edge cases, error states
3. Write tests using Jest — place in `src/__tests__/` for frontend, colocate for backend
4. Run `npm test` to confirm all pass
5. Report coverage of the target (branches hit vs missed)

## Rules
- No mocking unless the dependency is external (API, DB, filesystem)
- Test behavior, not implementation details
- One assertion focus per test
