# Dynamic Form Builder - Documentazione

## Panoramica

Il Dynamic Form Builder trasforma il BEP wizard in un sistema a **due livelli** completamente personalizzabile:

- **Step (H1)** = Sezioni che possono essere aggiunte, rimosse, riordinate, rinominate
- **Fields (H2)** = Campi del form all'interno di ogni step, completamente configurabili

Il template di default mantiene i 14 step ISO 19650, ma ogni progetto può personalizzare l'intera struttura.

---

## Architettura

### Database Schema

Nuove tabelle aggiunte in `server/db/database.js`:

```sql
-- Configurazione Step (livello H1)
bep_step_configs (
    id TEXT PRIMARY KEY,
    project_id TEXT,              -- NULL = template globale
    step_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,                -- 'Commercial', 'Management', 'Technical'
    order_index INTEGER NOT NULL,
    is_visible INTEGER DEFAULT 1,
    icon TEXT,                    -- Nome icona Lucide
    bep_type TEXT,                -- 'pre-appointment', 'post-appointment', 'both'
    created_at TEXT,
    updated_at TEXT,
    is_deleted INTEGER DEFAULT 0
)

-- Configurazione Fields (livello H2)
bep_field_configs (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    step_id TEXT NOT NULL,        -- FK a bep_step_configs.id
    field_id TEXT NOT NULL,       -- slug unico (es. "projectName")
    label TEXT NOT NULL,
    type TEXT NOT NULL,           -- tipo dal registry
    number TEXT,                  -- numero campo (es. "1.1")
    order_index INTEGER NOT NULL,
    is_visible INTEGER DEFAULT 1,
    is_required INTEGER DEFAULT 0,
    placeholder TEXT,
    help_text TEXT,
    config TEXT,                  -- JSON: opzioni specifiche per tipo
    default_value TEXT,
    bep_type TEXT,
    created_at TEXT,
    updated_at TEXT,
    is_deleted INTEGER DEFAULT 0
)
```

### API Endpoints

File: `server/routes/bep-structure.js`

#### Step Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/bep-structure/steps` | Lista step (con query projectId) |
| GET | `/api/bep-structure/steps/:id` | Singolo step con i suoi fields |
| POST | `/api/bep-structure/steps` | Crea nuovo step |
| PUT | `/api/bep-structure/steps/:id` | Aggiorna step |
| DELETE | `/api/bep-structure/steps/:id` | Soft delete step |
| PUT | `/api/bep-structure/steps-reorder` | Riordina step in bulk |
| PUT | `/api/bep-structure/steps/:id/visibility` | Toggle visibilità |

#### Field Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/bep-structure/fields` | Lista fields (con query stepId) |
| GET | `/api/bep-structure/fields/:id` | Singolo field |
| POST | `/api/bep-structure/fields` | Crea nuovo field |
| PUT | `/api/bep-structure/fields/:id` | Aggiorna field |
| DELETE | `/api/bep-structure/fields/:id` | Soft delete field |
| PUT | `/api/bep-structure/fields-reorder` | Riordina fields in bulk |
| PUT | `/api/bep-structure/fields/:id/visibility` | Toggle visibilità |
| PUT | `/api/bep-structure/fields/:id/move` | Sposta field in altro step |

#### Template Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/bep-structure/template` | Template default 14 step |
| GET | `/api/bep-structure/project/:projectId` | Struttura progetto |
| POST | `/api/bep-structure/clone-template` | Clona template per progetto |
| POST | `/api/bep-structure/reset/:projectId` | Reset a template default |
| GET | `/api/bep-structure/field-types` | Tipi field disponibili |
| POST | `/api/bep-structure/seed-defaults` | Seed defaults da bepConfig.js |

---

## Componenti Frontend

### Nuovi File Creati

```
src/components/form-builder/
├── index.js                       # Export principale
├── FormBuilderContext.js          # Context per stato struttura
├── useBepStructure.js             # Hook per API calls
├── FieldTypeRegistry.js           # Registry tipo → componente
├── DynamicFieldRenderer.js        # Renderizza field dinamicamente
├── DynamicFormStepRHF.js          # Step con fields da database
├── DynamicProgressSidebar.js      # Sidebar con edit mode
│
├── step-editor/
│   ├── index.js
│   ├── StepStructureEditor.js     # Editor lista step
│   ├── StepListDraggable.js       # Drag-drop step
│   ├── StepCard.js                # Card singolo step
│   └── StepEditorModal.js         # Modal add/edit step
│
└── field-editor/
    ├── index.js
    ├── FieldStructureEditor.js    # Editor fields nello step
    ├── FieldListDraggable.js      # Drag-drop fields
    ├── FieldCard.js               # Card singolo field
    ├── FieldEditorModal.js        # Modal add/edit field
    └── FieldTypeSelector.js       # Griglia selezione tipo
```

### File Modificati

| File | Modifiche |
|------|-----------|
| `src/components/pages/bep/BepFormView.js` | Wrapping con FormBuilderProvider, FormStepRenderer dinamico |
| `src/components/pages/bep/components/BepSidebar.js` | Supporto DynamicProgressSidebar |
| `server/app.js` | Registrazione route bep-structure |
| `server/db/database.js` | Nuove tabelle step_configs e field_configs |

---

## Field Type Registry

Il registry mappa ogni tipo di field al suo componente React:

```javascript
FIELD_TYPE_REGISTRY = {
  // Basic
  text: { component: 'TextInput', category: 'basic', icon: 'Type' },
  textarea: { component: 'TipTapEditor', category: 'basic', icon: 'AlignLeft' },
  select: { component: 'SelectInput', category: 'basic', icon: 'ChevronDown' },
  checkbox: { component: 'CheckboxGroup', category: 'basic', icon: 'CheckSquare' },

  // Tables
  table: { component: 'EditableTable', category: 'table', icon: 'Table' },
  introTable: { component: 'IntroTableField', category: 'table', icon: 'FileText' },
  standardsTable: { component: 'StandardsTable', category: 'table', icon: 'BookOpen' },

  // Specialized
  'naming-conventions': { component: 'NamingConventionBuilder', category: 'specialized' },
  'federation-strategy': { component: 'FederationStrategyBuilder', category: 'specialized' },

  // Diagrams
  cdeDiagram: { component: 'CDEPlatformEcosystem', category: 'diagram' },
  orgchart: { component: 'OrgStructureField', category: 'diagram' },
  fileStructure: { component: 'FolderStructureDiagram', category: 'diagram' },
  mindmap: { component: 'VolumeStrategyMindmap', category: 'diagram' },

  // Utility
  'section-header': { component: 'SectionHeader', category: 'utility', isFormField: false },
  timeline: { component: 'TimelineInput', category: 'specialized' },
  budget: { component: 'BudgetInput', category: 'specialized' },
  // ... 35+ tipi totali
}
```

---

## Dipendenze Aggiunte

```json
{
  "@dnd-kit/core": "^6.x",
  "@dnd-kit/sortable": "^8.x",
  "@dnd-kit/utilities": "^3.x",
  "@dnd-kit/modifiers": "^7.x"
}
```

---

## Come Usare

### 1. Avviare l'applicazione

```bash
npm start
```

### 2. Aprire il BEP Wizard

Naviga a un nuovo draft BEP o aprine uno esistente.

### 3. Entrare in Edit Mode

Nella sidebar, clicca l'icona **ingranaggio** (⚙️) accanto a "Progress Overview".

### 4. Modificare la Struttura

**Step (H1):**
- Drag & drop per riordinare
- Icona occhio (👁) per nascondere/mostrare
- Icona matita (✎) per modificare titolo/descrizione
- Pulsante "+ Add Step" per aggiungere

**Fields (H2):**
- Nel contenuto principale, clicca "Edit Fields"
- Drag & drop per riordinare
- Toggle visibilità e required
- Seleziona tipo da griglia visuale

### 5. Uscire da Edit Mode

Clicca "Done" nella sidebar per tornare alla visualizzazione normale.

---

## Seed Database

Per popolare il database con il template default da `bepConfig.js`:

```bash
node server/scripts/seed-bep-structure.js
```

Questo crea 14 step e ~121 fields basati sulla configurazione ISO 19650.

---

## Note Tecniche

### Soft Delete

Step e fields non vengono mai eliminati fisicamente. Il campo `is_deleted` viene impostato a 1, permettendo:
- Ripristino di elementi eliminati
- Audit trail delle modifiche
- Protezione da eliminazioni accidentali

### Cascading

Quando uno step viene eliminato, tutti i suoi fields vengono automaticamente marcati come eliminati (CASCADE).

### Project vs Template

- `project_id = NULL` → Template globale (default per tutti)
- `project_id = <id>` → Struttura specifica del progetto

Quando un progetto modifica la struttura, viene creata una copia (clone) dal template.

---

## Struttura API Response

### GET /api/bep-structure/template

```json
{
  "success": true,
  "data": [
    {
      "id": "step-1",
      "step_number": "1",
      "title": "Project Information",
      "category": "Commercial",
      "order_index": 0,
      "fields": [
        {
          "id": "field-1-1",
          "field_id": "projectName",
          "label": "Project Name",
          "type": "text",
          "number": "1.1",
          "is_required": 1
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### "Failed to load structure"

1. Verificare che il server sia in esecuzione (`npm start`)
2. Controllare che il database sia stato seeded:
   ```bash
   node server/scripts/seed-bep-structure.js
   ```

### Icona ingranaggio non visibile

1. Verificare che `FormBuilderProvider` wrappa `BepFormViewContent`
2. Controllare che l'import di `DynamicProgressSidebar` sia corretto

### Drag & drop non funziona

Verificare che `@dnd-kit` sia installato:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/modifiers
```
