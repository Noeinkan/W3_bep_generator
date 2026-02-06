# Remaining Modal Migrations

These 6 files still use bespoke overlay/modal implementations and should be migrated to the shared `Modal` (and optionally `Button` / `Select`) components from `src/components/common/`.

---

## 1. `FieldEditorModal.js`

**Path:** `src/components/form-builder/field-editor/FieldEditorModal.js`  
**Lines:** 384  
**Complexity:** Medium  

### Current Implementation
- Custom `fixed inset-0` overlay with `absolute inset-0 bg-black/50` backdrop div
- Manual `onClick={onClose}` on backdrop
- Custom header with `X` close button
- Guard: `if (!isOpen) return null`
- `max-h-[90vh] overflow-hidden flex flex-col` for scrollable body

### Migration Steps
1. Import `Modal` and `Button` from `../../common`
2. Remove `X` from lucide imports (Modal provides its own close button)
3. Remove the `if (!isOpen) return null` guard — Modal handles this via `open` prop
4. Replace outer `<div className="fixed inset-0 ...">` + backdrop `<div>` + inner panel `<div>` with:
   ```jsx
   <Modal
     open={isOpen}
     onClose={onClose}
     title={isEditing ? 'Edit Field' : 'Add New Field'}
     size="md"
     className="max-h-[90vh] overflow-hidden flex flex-col"
     footer={/* move footer buttons here */}
   >
   ```
5. Replace footer `<button>` elements with `<Button>` components
6. Keep internal body content unchanged (FieldTypeSelector, form inputs, advanced section)

### Notes
- No `<select>` elements — field type selection uses `FieldTypeSelector` component
- The `flex flex-col` + `overflow-y-auto` pattern for scrollable body needs to be preserved — may require `className` override on Modal


---

## 2. `StepEditorModal.js`

**Path:** `src/components/form-builder/step-editor/StepEditorModal.js`  
**Lines:** 302  
**Complexity:** Medium  

### Current Implementation
- Custom `fixed inset-0` overlay with backdrop
- Manual `onClick={onClose}` on backdrop
- Custom header with `X` close button
- Guard: `if (!isOpen) return null`
- 1 inline `<select>` for BEP type (line 252)
- Footer with Cancel/Save buttons using inline spinner

### Migration Steps
1. Import `Modal`, `Button`, `Select` from `../../common`
2. Remove `X` from lucide imports
3. Remove the `if (!isOpen) return null` guard
4. Replace outer overlay structure with:
   ```jsx
   <Modal
     open={isOpen}
     onClose={onClose}
     title={isEditing ? 'Edit Step' : 'Add New Step'}
     size="sm"
     footer={
       <>
         <Button variant="secondary" onClick={onClose}>Cancel</Button>
         <Button
           onClick={handleSave}
           disabled={isSaving}
           loading={isSaving}
           icon={isEditing ? Save : Plus}
         >
           {isEditing ? 'Save Changes' : 'Add Step'}
         </Button>
       </>
     }
   >
   ```
5. Replace the inline `<select>` for "Applies To" (BEP type) with:
   ```jsx
   <Select
     label="Applies To"
     name="bep_type"
     value={formData.bep_type}
     onChange={handleChange}
     placeholder={null}
     options={[
       { value: 'both', label: 'Both BEP Types' },
       { value: 'pre-appointment', label: 'Pre-Appointment Only' },
       { value: 'post-appointment', label: 'Post-Appointment Only' },
     ]}
   />
   ```

### Notes
- Straightforward migration, no complex layout requirements
- Category selector uses radio buttons, not selects — leave as-is


---

## 3. `FullscreenTableModal.js`

**Path:** `src/components/forms/base/FullscreenTableModal.js`  
**Lines:** 325  
**Complexity:** High — **Do NOT migrate to shared Modal**  

### Current Implementation
- Uses `createPortal` directly
- Browser Fullscreen API integration (`requestFullscreen` / `exitFullscreen`)
- Hierarchical ESC handling (exit fullscreen first, then close modal)
- Dynamic dimension calculation via `ResizeObserver`
- Aware of MainLayout topbar height for positioning
- Fade-in/out CSS animations
- Custom toolbar with fullscreen toggle button

### Why Not to Migrate
This is a **specialized fullscreen component**, not a standard dialog. The shared `Modal` component is designed for centered dialogs with standard overlay/body/footer patterns. `FullscreenTableModal`:
- Takes up the entire viewport below the nav bar, not a centered panel
- Integrates with the browser Fullscreen API
- Has custom hierarchical ESC behavior
- Uses ResizeObserver for responsive dimensions

### Recommended Action
- **Keep as-is.** This component is purpose-built and doesn't share enough behavior with `Modal` to benefit from migration.
- Optionally, extract any shared utilities (e.g., ESC key handling) into a custom hook if duplication with `FullscreenDiagramModal` becomes a maintenance concern.


---

## 4. `FullscreenDiagramModal.js`

**Path:** `src/components/forms/diagrams/diagram-ui/FullscreenDiagramModal.js`  
**Lines:** 323  
**Complexity:** High — **Do NOT migrate to shared Modal**  

### Current Implementation
- Nearly identical architecture to `FullscreenTableModal`
- Uses `createPortal`, browser Fullscreen API, ResizeObserver
- Uses `react-focus-lock` for focus trapping
- Hierarchical ESC handling
- Fade-in/out animations
- Custom toolbar with fullscreen toggle

### Why Not to Migrate
Same reasons as `FullscreenTableModal` — this is a specialized fullscreen focus-mode component (inspired by Miro's presentation mode), not a standard dialog.

### Recommended Action
- **Keep as-is.**
- Consider extracting a shared `useFullscreenModal` hook from `FullscreenTableModal` and `FullscreenDiagramModal` to deduplicate the ~80% shared logic (ResizeObserver, fullscreen API, ESC handling, animations).


---

## 5. `TIDPImportDialog.js`

**Path:** `src/components/tidp/TIDPImportDialog.js`  
**Lines:** 383  
**Complexity:** Medium-High  

### Current Implementation
- Custom `fixed inset-0 bg-black bg-opacity-50` overlay
- Custom header with `✕` text close button
- Guard: `if (!open) return null`
- No `<select>` elements — import type uses radio buttons
- Multi-state UI: import form → results display
- File upload with `useRef(fileInputRef)`
- Integrates with `Papa.parse`, `XLSX`, and `ApiService`

### Migration Steps
1. Import `Modal` and `Button` from `../common`
2. Remove `if (!open) return null` guard
3. Replace outer overlay with:
   ```jsx
   <Modal
     open={open}
     onClose={onClose}
     title="Import TIDPs"
     size="lg"
     className="max-h-[90vh] overflow-y-auto"
   >
   ```
4. Replace inline close/action buttons with `<Button>` components:
   - "Download Template" button → `<Button variant="secondary" icon={Download}>`
   - "Close" button in results view → `<Button variant="secondary">`
   - Upload file button → keep as `<label>` trigger for hidden input (or use `Button` with `onClick`)
5. Keep all internal logic unchanged (Papa.parse, XLSX, ApiService calls)

### Notes
- The "import type" radio buttons and file input can stay as-is
- Results section (showing successful/failed imports) is conditional — no layout changes needed
- Consider adding `footer` prop with close button for the results state


---

## 6. `SmartHelpDialog.js`

**Path:** `src/components/forms/ai/SmartHelpDialog.js`  
**Lines:** 907  
**Complexity:** High — **Partial migration only**  

### Current Implementation
- Uses `<>` fragment with separate backdrop `div` + dialog `div` (not nested)
- `z-[9998]` backdrop + `z-[9999]` dialog (custom z-index)
- `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` centering (not flex)
- Gradient header (`bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500`)
- Complex tabbed interface with 4-5 tabs
- AI generation with streaming responses (axios)
- Real-time markdown-to-HTML conversion
- Auto-scroll via `useRef`

### Why Partial Migration Only
The overlay/ESC/backdrop behavior can use `Modal`, but the **custom gradient header** and high z-index needs special handling. The body content (907 lines of tabbed AI interface) should remain untouched.

### Migration Steps
1. Import `Modal` from `../../common`
2. Remove the fragment wrapper and separate backdrop div
3. Replace with `Modal` using **no `title` prop** (to skip the default header):
   ```jsx
   <Modal
     open={true}
     onClose={onClose}
     size="lg"
     className="max-h-[90vh] overflow-hidden flex flex-col"
   >
     {/* Keep the custom gradient header as the first child */}
     <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white p-6 flex-shrink-0">
       ...
     </div>
     {/* Keep the rest of the body content */}
   </Modal>
   ```
4. Remove the `X` import only if no other usage remains
5. Keep all tabbed content, AI logic, and streaming unchanged

### Notes
- The `z-[9999]` custom z-index was needed because this dialog can appear above other modals — `Modal` uses `z-50` by default which may be insufficient if stacked. Verify stacking context.
- The `auto-scroll into view` behavior via `useRef` + `scrollIntoView` will need to be adapted since Modal uses a portal.
- Consider whether this component truly needs `Modal` at all given its unique requirements — the benefit is mainly ESC handling and body scroll lock.


---

## Priority Order

| Priority | File | Effort | Impact |
|----------|------|--------|--------|
| 1 | `StepEditorModal.js` | Low | Modal + Button + Select |
| 2 | `FieldEditorModal.js` | Low-Med | Modal + Button |
| 3 | `TIDPImportDialog.js` | Medium | Modal + Button |
| 4 | `SmartHelpDialog.js` | Medium | Modal (partial — custom header) |
| 5 | `FullscreenTableModal.js` | N/A | Keep as-is (extract shared hook) |
| 6 | `FullscreenDiagramModal.js` | N/A | Keep as-is (extract shared hook) |

## Shared Components Reference

| Component | Import Path | Key Props |
|-----------|-------------|-----------|
| `Modal` | `src/components/common/Modal.js` | `open`, `onClose`, `title`, `size` (sm/md/lg/xl/full), `footer`, `className` |
| `Button` | `src/components/common/Button.js` | `variant` (primary/secondary/danger/ghost/success), `size`, `icon`, `loading`, `fullWidth` |
| `Select` | `src/components/common/Select.js` | `label`, `value`, `onChange`, `options`, `placeholder`, `error` |

## Already Migrated (for reference)

- `ConfirmDialog.js` → Modal + Button
- `EditModal.js` → Modal + Button
- `FindReplaceDialog.js` → Modal + Button
- `TableInsertDialog.js` → Modal + Button
- `HelpModal.js` (IDRM) → Modal + Button
- `HelpModal.js` (TIDP-MIDP) → Modal
- `SaveDraftDialog.js` → Modal + Button
- `ImportBepDialog.js` → Modal + Button
- `SearchAndFilters.js` → Select (3 instances)
