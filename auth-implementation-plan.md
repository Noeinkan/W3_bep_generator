# Authentication Implementation Plan

## Overview
Add login, register, and protected route features to the BEP Generator application.

## User Preferences
- **Route access**: Keep `/home` public, protect all other routes
- **Password reset**: Include password reset functionality

## Current State
- **Frontend**: AuthContext exists but is localStorage-only (demo mode)
- **Backend**: No users table, but auth middleware pattern exists in documents route
- **Patterns**: React Hook Form + Zod, service layer, better-sqlite3 (sync)

---

## Implementation Steps

### 1. Database Schema (server/db/database.js)

Add users and password reset tables:
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login TEXT,
  is_active INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
```

### 2. Backend - Install Dependencies

```bash
npm install bcryptjs jsonwebtoken
```

### 3. Backend - Auth Service (server/services/authService.js)

Create new file with:
- `hashPassword(password)` - bcrypt hash
- `verifyPassword(password, hash)` - bcrypt compare
- `generateToken(userId)` - JWT sign
- `verifyToken(token)` - JWT verify
- `createUser(email, password, name)` - register user
- `authenticateUser(email, password)` - login user
- `getUserById(id)` - get user by id

### 4. Backend - Auth Middleware (server/middleware/authMiddleware.js)

Create new file with:
- `authenticateToken` - verify JWT from Authorization header
- Attach `req.user` with user data for downstream routes

### 5. Backend - Auth Routes (server/routes/auth.js)

Create new file with:
- `POST /api/auth/register` - create user, return token
- `POST /api/auth/login` - authenticate, return token
- `POST /api/auth/logout` - client-side token removal
- `GET /api/auth/me` - get current user (protected)
- `POST /api/auth/forgot-password` - generate reset token, store in DB
- `POST /api/auth/reset-password` - verify reset token, update password

### 6. Backend - Validator (server/validators/authValidator.js)

Create Joi schemas:
- `registerSchema` - email, password (min 8 chars), name
- `loginSchema` - email, password

### 7. Backend - Register Routes (server/app.js)

Add auth routes and apply middleware to protected routes.

### 8. Frontend - Auth Schemas (src/schemas/authSchemas.js)

Create Zod schemas:
- `loginSchema` - email, password
- `registerSchema` - email, password, confirmPassword, name

### 9. Frontend - Auth Pages

Create in `src/components/pages/auth/`:
- `LoginPage.js` - login form with React Hook Form + Zod
- `RegisterPage.js` - registration form
- `ForgotPasswordPage.js` - request password reset
- `ResetPasswordPage.js` - set new password (with token from URL)

### 10. Frontend - ProtectedRoute Component (src/components/ProtectedRoute.js)

Create wrapper that:
- Checks `useAuth().user` and `loading` state
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking auth

### 11. Frontend - Update AuthContext (src/contexts/AuthContext.js)

Modify to:
- Call real API endpoints via apiService
- Store JWT token in localStorage
- Add `isAuthenticated` computed value
- Handle token refresh/expiry

### 12. Frontend - Update apiService (src/services/apiService.js)

Add auth methods:
- `login(email, password)`
- `register(email, password, name)`
- `getCurrentUser()`
- `logout()`

### 13. Frontend - Update App.js Routes

**Public routes** (no auth required):
- `/home` - landing page
- `/login` - login page
- `/register` - registration page
- `/forgot-password` - request reset
- `/reset-password/:token` - set new password

**Protected routes** (wrap with `<ProtectedRoute>`):
- `/bep-generator/*`
- `/tidp-midp/*`
- `/idrm-manager/*`
- `/tidp-editor/*`
- `/responsibility-matrix`
- `/profile`
- `/settings`

---

## Files to Create
| File | Purpose |
|------|---------|
| server/services/authService.js | Auth business logic |
| server/middleware/authMiddleware.js | JWT verification |
| server/routes/auth.js | Auth API endpoints |
| server/validators/authValidator.js | Joi validation |
| src/schemas/authSchemas.js | Zod validation |
| src/components/pages/auth/LoginPage.js | Login UI |
| src/components/pages/auth/RegisterPage.js | Register UI |
| src/components/pages/auth/ForgotPasswordPage.js | Request reset |
| src/components/pages/auth/ResetPasswordPage.js | Set new password |
| src/components/ProtectedRoute.js | Route guard |

## Files to Modify
| File | Changes |
|------|---------|
| server/db/database.js | Add users table |
| server/app.js | Register auth routes |
| src/contexts/AuthContext.js | Use real API |
| src/services/apiService.js | Add auth methods |
| src/App.js | Add routes, protect existing |

---

## Implementation Order
1. Database schema + dependencies
2. Backend: authService → authMiddleware → authValidator → auth routes
3. Register routes in app.js
4. Frontend: authSchemas → apiService methods
5. Frontend: AuthContext updates
6. Frontend: LoginPage + RegisterPage
7. Frontend: ProtectedRoute + route updates
8. Testing

## Verification
1. Register a new user via `/register` page
2. Login with credentials via `/login` page
3. Access protected route (should work when logged in)
4. Logout and try protected route (should redirect to login)
5. Try invalid credentials (should show error)
6. Run `npm test` for any affected tests

---

## Security Notes
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiry (e.g., 24h)
- Token stored in localStorage (acceptable for this app)
- 401 responses already handled by apiService interceptor
- Password reset tokens expire in 1 hour
- Reset tokens are one-time use

## Password Reset Note
Since email is not configured, password reset links will be logged to the console in development mode. This allows testing the flow without email setup. Email integration can be added later.
