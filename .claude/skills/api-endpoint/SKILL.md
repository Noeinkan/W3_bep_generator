# API Endpoint

Use when adding a new API endpoint. Follows the project's 3-layer pattern.

## Steps
1. Confirm: HTTP method, path, request/response shape
2. Route → `server/routes/` — define Express route with validation
3. Service → `server/services/` — business logic + DB calls (sync, better-sqlite3)
4. Frontend → `src/services/apiService.js` — add fetch wrapper
5. Run `npm test`

## Rules
- DB calls are synchronous — no async/await around better-sqlite3
- Validate input at the route layer
- Return consistent error shape: `{ error: string }`
