# Analyze Code

Use when analyzing code for refactoring opportunities: long functions, duplicated blocks, and clean code violations.

## Invocation

`/analyze-code <file-or-directory>` — analyzes the target for refactoring opportunities.

If no argument is given, ask the user what file or directory to analyze.

## Analysis checks

Perform each check in order. For every finding, include `file:line` reference.

### 1. Long functions

- **Threshold**: functions/methods > 25 lines of logic (exclude blank lines, comments, and braces-only lines).
- For each violation, report:
  - Function name, line span, and logic-line count
  - A concrete suggestion on how to split it (name the extracted functions/methods and what they would contain)
- Goal: each function should ideally do one thing in 3–15 lines.

### 2. Duplicated code blocks

- Scan for blocks of **3+ similar consecutive lines** appearing in 2+ places (same file or across files in scope).
- "Similar" means structurally identical after ignoring variable names, string literals, and whitespace.
- For each duplicate cluster, report:
  - All locations (file:line ranges)
  - A suggested extracted function name, parameters, and return value

### 3. Single Responsibility violations

- Flag functions/components that handle **more than one concern** (e.g., data fetching + rendering + validation in one function).
- Suggest how to separate concerns (e.g., custom hook, utility function, sub-component).

### 4. Reusability opportunities

- Identify repeated **patterns** (not just identical code) that could become shared utilities or higher-order functions.
- Examples: repeated error-handling wrappers, repeated data transformations, repeated UI patterns.

## Output format

Return a structured markdown report:

```
## Code Analysis: <target>

### Summary
- Files scanned: N
- Total functions analyzed: N
- Issues found: N (X critical, Y suggestions)

### Long Functions (> 25 lines)
| # | Function | File:Lines | Logic lines | Suggested split |
|---|----------|-----------|-------------|-----------------|
| 1 | ...      | ...       | ...         | ...             |

### Duplicated Code
| # | Locations | Lines duplicated | Suggested extraction |
|---|-----------|-----------------|---------------------|
| 1 | ...       | ...             | ...                 |

### Single Responsibility Violations
| # | Function/Component | File:Line | Concerns mixed | Suggestion |
|---|--------------------|-----------|----------------|------------|
| 1 | ...                | ...       | ...            | ...        |

### Reusability Opportunities
| # | Pattern | Locations | Suggested abstraction |
|---|---------|-----------|----------------------|
| 1 | ...     | ...       | ...                  |

### Recommended refactoring order
1. ... (highest impact first)
```

## Rules

- Read only files in scope — do not explore unrelated code.
- For directories, analyze all `.js`, `.jsx`, `.ts`, `.tsx`, and `.py` files (skip `node_modules/`, `build/`, `dist/`, `venv/`, `__pycache__/`).
- Skip categories with zero findings rather than writing "none found".
- Prioritize findings by impact: duplicated code > long functions > SRP violations > reusability.
- Do NOT make any code changes — this is analysis only. Suggest a `/refactor` follow-up for fixes.
- Keep the report concise: max 3 sentences per suggestion.

## Language-specific guidance

### JavaScript / React
- Component functions > 25 JSX lines (excluding props destructuring) count as long.
- Hooks that mix data fetching, transformation, and side effects are SRP violations.
- Repeated `try/catch` + `fetch` patterns are prime extraction candidates.
- Anonymous inline functions in JSX that exceed 3 lines should be named and extracted.

### Python
- Methods > 25 lines of logic (excluding docstrings, type hints, decorators) count as long.
- Classes with > 5 public methods may violate SRP — flag for review.
- Repeated context manager patterns or decorator stacks are reusability candidates.
