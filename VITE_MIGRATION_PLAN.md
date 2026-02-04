# CRA to Vite Migration Plan

## Overview
Migrate from Create React App (react-scripts 5.0.1) to Vite for dramatically faster dev server startup and HMR.

**Risk Level:** Low - No webpack overrides, clean CRA setup

---

## Step 1: Create Backup Branch
```bash
git checkout -b feature/vite-migration
```

---

## Step 2: Update package.json

**Remove:**
- `react-scripts` dependency
- `proxy` field
- `eslintConfig` section

**Add devDependencies:**
```json
"vite": "^5.4.0",
"@vitejs/plugin-react": "^4.3.0",
"vitest": "^2.0.0",
"jsdom": "^24.1.0"
```

**Update scripts:**
```json
"start:frontend": "vite",
"build": "vite build",
"preview": "vite preview",
"test": "vitest"
```

Remove `NODE_OPTIONS=--max-old-space-size=8192` (Vite doesn't need it).

---

## Step 3: Create vite.config.js (project root)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  envPrefix: 'VITE_',
});
```

---

## Step 4: Move and Update index.html

**Move:** `public/index.html` → `index.html` (root)

**Changes:**
1. Replace all `%PUBLIC_URL%` with `/`:
   - `%PUBLIC_URL%/favicon.ico` → `/favicon.ico`
   - `%PUBLIC_URL%/logo192.png` → `/logo192.png`
   - `%PUBLIC_URL%/manifest.json` → `/manifest.json`
   - etc.

2. Add before closing `</body>`:
```html
<script type="module" src="/src/index.jsx"></script>
```

---

## Step 5: Rename Entry Point

**Rename:** `src/index.js` → `src/index.jsx`

(No content changes needed)

---

## Step 6: Fix Environment Variable Usage

**File:** `src/components/form-builder/useBepStructure.js` (lines 10-11)

```javascript
// BEFORE:
const API_BASE_URL = process.env.REACT_APP_API_URL
  || (typeof window !== 'undefined' ? window.location.origin : '');

// AFTER:
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' ? window.location.origin : '');
```

---

## Step 7: Fix Hardcoded URL (Bug Fix)

**File:** `src/components/forms/ai/AISuggestionButton.js` (line 30)

```javascript
// BEFORE:
const response = await axios.post('http://localhost:3001/api/ai/suggest', {

// AFTER:
const response = await axios.post('/api/ai/suggest', {
```

---

## Step 8: Update Server Build Path

**File:** `server/server.js` (lines 73, 76)

```javascript
// BEFORE:
app.use(express.static(path.join(__dirname, '../build')));
res.sendFile(path.join(__dirname, '../build', 'index.html'));

// AFTER:
app.use(express.static(path.join(__dirname, '../dist')));
res.sendFile(path.join(__dirname, '../dist', 'index.html'));
```

---

## Step 9: Configure Vitest

**Create:** `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
```

---

## Step 10: Update .gitignore

Add:
```
dist
*.local
```

---

## Step 11: Clean Up Environment Files

**Remove from .env.development:**
```
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
(Vite doesn't need this)

---

## Files Modified Summary

| File | Change |
|------|--------|
| `package.json` | Remove react-scripts, add Vite deps, update scripts |
| `vite.config.js` | Create new (proxy config, build settings) |
| `index.html` | Move from public/, remove %PUBLIC_URL%, add script |
| `src/index.js` → `src/index.jsx` | Rename only |
| `src/components/form-builder/useBepStructure.js` | process.env → import.meta.env |
| `src/components/forms/ai/AISuggestionButton.js` | Fix hardcoded localhost URL |
| `server/server.js` | Change build/ to dist/ |
| `vitest.config.js` | Create new |
| `.gitignore` | Add dist |
| `.env.development` | Remove CRA-specific var |

---

## Verification

1. **Dev server:** `npm run start:frontend` - should start in <1 second
2. **Full stack:** `npm start` - all 3 services run
3. **API proxy:** Navigate to page with API calls, verify they work
4. **HMR:** Edit a component, see instant update
5. **Build:** `npm run build` - creates `dist/` folder
6. **Tests:** `npm test` - all tests pass

---

## Rollback

If issues occur:
```bash
git checkout master
```
