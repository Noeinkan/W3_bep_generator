# Piano di Implementazione: Analisi Documenti EIR per BEP Suite

## Panoramica Architettura Attuale

```
Frontend (React 19)          Backend (Express)           ML Service (FastAPI)
├── Tailwind CSS             ├── SQLite (better-sqlite3) ├── Ollama (llama3.2:3b)
├── React Hook Form + Zod    ├── /api/drafts             ├── /generate
├── TipTap Editor            ├── /api/ai (proxy)         ├── /suggest
├── 14-step Wizard           ├── /api/tidp, /api/midp    └── /health
└── Axios per API            └── Port 3001               └── Port 8000
```

---

## FASE 1: Upload Documenti (Backend + Frontend)

### 1.1 Backend - Nuova tabella e route per documenti

**File: `server/db/database.js`** - Aggiungere tabella:
```sql
CREATE TABLE IF NOT EXISTS client_documents (
  id TEXT PRIMARY KEY,
  draft_id TEXT,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  extracted_text TEXT,
  analysis_json TEXT,
  summary_markdown TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_draft_id ON client_documents(draft_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON client_documents(user_id);
```

**File: `server/routes/documents.js`** (NUOVO) - Endpoint:
- `POST /api/documents/upload` - Upload file con multer
- `GET /api/documents/:id` - Ottieni documento
- `GET /api/documents?userId=xxx&draftId=xxx` - Lista documenti
- `DELETE /api/documents/:id` - Elimina documento
- `POST /api/documents/:id/extract` - Trigger estrazione testo
- `POST /api/documents/:id/analyze` - Trigger analisi AI

**File: `server/package.json`** - Aggiungere:
```json
"multer": "^1.4.5-lts.1"
```

**Cartella uploads:** `server/uploads/` (aggiungere a .gitignore)

### 1.2 Frontend - Componente Upload

**File: `src/components/eir/EirUploadStep.js`** (NUOVO)
- Dropzone per drag-and-drop (usando HTML5 nativo o libreria leggera)
- Supporto PDF e DOCX
- Progress bar per upload
- Lista file caricati con stato
- Validazione: max 20MB per file, max 5 file

**File: `src/services/documentService.js`** (NUOVO)
- `uploadDocument(file, draftId)` - Upload con FormData
- `getDocuments(draftId)` - Lista documenti
- `deleteDocument(id)` - Elimina
- `extractText(id)` - Trigger estrazione
- `analyzeDocument(id)` - Trigger analisi
- `getAnalysis(id)` - Ottieni risultati

### 1.3 Integrazione nel Wizard

**Opzione A (Consigliata):** Step 0 opzionale prima di "Project Information"
- Modificare `src/config/bepConfig.js` per aggiungere step iniziale
- Aggiungere route in `BepFormView.js`

**Opzione B:** Sezione collassabile nel primo step
- Banner "Hai un EIR da caricare?" in step 1
- Espansione modale per upload

---

## FASE 2: Estrazione Testo (ML Service)

### 2.1 Nuove dipendenze Python

**File: `ml-service/requirements.txt`** - Aggiungere:
```
PyPDF2>=3.0.0
pdfplumber>=0.10.0
python-docx>=1.1.0
```

### 2.2 Nuovo modulo estrazione

**File: `ml-service/text_extractor.py`** (NUOVO)
```python
class TextExtractor:
    def extract_from_pdf(filepath: str) -> str
    def extract_from_docx(filepath: str) -> str
    def extract(filepath: str) -> str  # Auto-detect
    def chunk_text(text: str, max_tokens: int = 4000) -> List[str]
```

### 2.3 Nuovo endpoint FastAPI

**File: `ml-service/api_ollama.py`** - Aggiungere:
```python
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    # Salva file temporaneo
    # Estrai testo
    # Ritorna { text, pages, word_count }
```

Alternative: ricevere filepath dal backend invece del file binario.

---

## FASE 3: Analisi AI con Ollama

### 3.1 Prompt ISO 19650 strutturato

**File: `ml-service/eir_analyzer.py`** (NUOVO)
```python
EIR_ANALYSIS_PROMPT = """
Sei un esperto di ISO 19650 e BIM. Analizza il seguente documento EIR
(Exchange Information Requirements) ed estrai le informazioni chiave
per la redazione di un BIM Execution Plan (BEP).

Restituisci SOLO un JSON valido con questa struttura:
{
  "project_info": {
    "name": string | null,
    "description": string | null,
    "location": string | null,
    "client": string | null
  },
  "bim_objectives": [string],
  "information_requirements": {
    "OIR": [string],
    "AIR": [string],
    "PIR": [string],
    "EIR_specifics": [string]
  },
  "delivery_milestones": [
    {"phase": string, "description": string, "date": string | null}
  ],
  "standards_protocols": {
    "classification_systems": [string],
    "naming_conventions": string | null,
    "file_formats": [string],
    "lod_loi_requirements": string | null
  },
  "cde_requirements": {
    "platform": string | null,
    "workflow_states": [string],
    "access_control": string | null
  },
  "roles_responsibilities": [
    {"role": string, "responsibilities": [string]}
  ],
  "software_requirements": [string],
  "plain_language_questions": [string],
  "specific_risks": [string],
  "other_requirements": [string]
}

Se un campo non è presente nel documento, usa null o array vuoto.

DOCUMENTO EIR:
{eir_text}
"""

SUMMARY_PROMPT = """
Basandoti sull'analisi JSON del documento EIR, genera un riassunto
in italiano in formato Markdown (max 500 parole) che:

1. Sintetizzi gli obiettivi BIM principali
2. Evidenzi i requisiti informativi chiave
3. Elenchi le milestone di consegna
4. Noti eventuali requisiti critici o non standard

JSON analisi:
{analysis_json}
"""
```

### 3.2 Nuovo endpoint analisi

**File: `ml-service/api_ollama.py`** - Aggiungere:
```python
@app.post("/analyze-eir")
async def analyze_eir(request: AnalyzeEirRequest):
    # 1. Ricevi testo estratto (o chunks)
    # 2. Chiama Ollama con prompt strutturato
    # 3. Parse JSON response
    # 4. Genera summary markdown
    # 5. Ritorna { analysis_json, summary_markdown, confidence_score }
```

### 3.3 Gestione chunking per documenti lunghi

Se il testo supera il context window di Ollama (~8k token per llama3.2:3b):
1. Dividi in chunk sovrapposti
2. Analizza ogni chunk
3. Merge intelligente dei risultati JSON

---

## FASE 4: Visualizzazione Risultati (Frontend)

### 4.1 Componente Riassunto EIR

**File: `src/components/eir/EirAnalysisView.js`** (NUOVO)
- Card con summary markdown (usando marked + DOMPurify esistenti)
- Accordion per sezioni JSON strutturato
- Stato loading/error
- Bottoni: "Usa nel BEP", "Rianalizza", "Scarica JSON"

### 4.2 Integrazione con TipTap esistente

Per mostrare il summary markdown:
- Usare TipTap in modalità read-only
- Oppure: `marked` + `DOMPurify` (già nel progetto)

### 4.3 Nuovo step o modale nel wizard

**Opzione A:** Step dedicato dopo upload
- Step 0.5: "Analisi EIR" (visibile solo se documenti caricati)

**Opzione B:** Modale/sidebar
- Pannello laterale con risultati sempre accessibile

---

## FASE 5: Suggerimenti e Pre-compilazione BEP

### 5.1 Nuovo endpoint per suggerimenti contestuali

**File: `ml-service/api_ollama.py`** - Aggiungere:
```python
@app.post("/suggest-from-eir")
async def suggest_from_eir(request: SuggestFromEirRequest):
    # Input: analysis_json + field_type + partial_text
    # Output: suggerimento specifico per quel campo
```

### 5.2 Integrazione nei campi form

**Modifica: `src/components/forms/base/InputFieldRHF.js`**
- Aggiungere prop `eirAnalysis`
- Se presente, mostrare icona "Suggerisci da EIR"
- onClick: chiama API e inserisce suggerimento

### 5.3 Mappatura campi EIR -> BEP

```javascript
const EIR_FIELD_MAPPING = {
  'projectName': 'project_info.name',
  'projectDescription': 'project_info.description',
  'bimGoals': 'bim_objectives',
  'bimUses': 'bim_objectives',
  'keyMilestones': 'delivery_milestones',
  'cdeStrategy': 'cde_requirements',
  'bimSoftware': 'software_requirements',
  'namingConventions': 'standards_protocols.naming_conventions',
  // ...
};
```

### 5.4 Pre-compilazione automatica (opzionale)

**File: `src/components/eir/EirPrefillDialog.js`** (NUOVO)
- Mostra preview dei campi che verranno pre-compilati
- Checkbox per selezionare quali campi popolare
- Bottone "Applica" che aggiorna il form

---

## FASE 6: Gestione Errori e UX

### 6.1 Stati di loading

- Upload: progress bar percentuale
- Estrazione: spinner + "Estraendo testo..."
- Analisi: spinner + "Analizzando con AI..." (può richiedere 30-60s)

### 6.2 Gestione errori

**Backend:**
- File troppo grande: 413 Payload Too Large
- Formato non supportato: 400 Bad Request
- Estrazione fallita: 422 Unprocessable Entity
- Ollama non raggiungibile: 503 Service Unavailable

**Frontend:**
- Toast notifiche per errori
- Retry automatico per errori transitori
- Fallback graceful se AI non disponibile

### 6.3 Pulizia file temporanei

**File: `server/scripts/cleanup-uploads.js`** (NUOVO)
- Cron job o script manuale
- Elimina file > 7 giorni
- Elimina file orfani (senza record DB)

---

## Ordine di Implementazione Consigliato

### Sprint 1: Infrastruttura Base
1. [ ] Aggiungere tabella `client_documents` al DB
2. [ ] Creare `server/routes/documents.js` con multer
3. [ ] Aggiungere endpoint upload + CRUD base
4. [ ] Creare `src/services/documentService.js`
5. [ ] Test upload/download file

### Sprint 2: Estrazione Testo
6. [ ] Aggiungere dipendenze Python (PyPDF2, python-docx)
7. [ ] Creare `ml-service/text_extractor.py`
8. [ ] Aggiungere endpoint `/extract-text`
9. [ ] Integrare estrazione nel backend (chiamata post-upload)
10. [ ] Test estrazione PDF e DOCX

### Sprint 3: Analisi AI
11. [ ] Creare `ml-service/eir_analyzer.py` con prompts
12. [ ] Aggiungere endpoint `/analyze-eir`
13. [ ] Implementare chunking per documenti lunghi
14. [ ] Aggiungere endpoint `/api/documents/:id/analyze` nel backend
15. [ ] Test analisi con EIR reali

### Sprint 4: Frontend Upload + Visualizzazione
16. [ ] Creare `src/components/eir/EirUploadStep.js`
17. [ ] Integrare upload nel wizard (step 0 o sezione)
18. [ ] Creare `src/components/eir/EirAnalysisView.js`
19. [ ] Mostrare risultati analisi
20. [ ] Test end-to-end upload -> analisi -> visualizzazione

### Sprint 5: Suggerimenti e Pre-fill
21. [ ] Aggiungere endpoint `/suggest-from-eir`
22. [ ] Creare mappatura campi EIR -> BEP
23. [ ] Aggiungere bottoni "Suggerisci da EIR" nei campi
24. [ ] (Opzionale) Creare dialog pre-compilazione
25. [ ] Test suggerimenti contestuali

### Sprint 6: Polish e Produzione
26. [ ] Migliorare UX con loading states
27. [ ] Gestione errori completa
28. [ ] Script pulizia file temporanei
29. [ ] Documentazione utente
30. [ ] Test di carico e ottimizzazioni

---

## File da Creare/Modificare

### Nuovi File
```
server/routes/documents.js          # API CRUD documenti
server/uploads/                     # Cartella upload (gitignore)
server/scripts/cleanup-uploads.js   # Script pulizia

ml-service/text_extractor.py        # Estrazione PDF/DOCX
ml-service/eir_analyzer.py          # Analisi AI con prompts

src/services/documentService.js     # API client documenti
src/components/eir/EirUploadStep.js # Componente upload
src/components/eir/EirAnalysisView.js # Visualizzazione risultati
src/components/eir/EirPrefillDialog.js # (Opzionale) Pre-fill
```

### File da Modificare
```
server/db/database.js               # Nuova tabella
server/server.js                    # Registrare route /api/documents
server/package.json                 # Aggiungere multer

ml-service/api_ollama.py            # Nuovi endpoint
ml-service/requirements.txt         # Nuove dipendenze

src/config/bepConfig.js             # Aggiungere step EIR
src/components/pages/bep/BepFormView.js  # Integrare step
src/components/forms/base/InputFieldRHF.js  # Bottone suggerimenti
```

---

## Stima Effort

| Fase | Complessita | Note |
|------|-------------|------|
| Fase 1 | Media | Multer + tabella DB standard |
| Fase 2 | Bassa | Librerie Python mature |
| Fase 3 | Alta | Prompt engineering + chunking |
| Fase 4 | Media | Componenti React standard |
| Fase 5 | Media-Alta | Mappatura campi + UI |
| Fase 6 | Bassa | Best practices esistenti |

---

## Considerazioni Tecniche

### Performance
- Estrazione PDF: ~1-2s per 50 pagine
- Analisi Ollama: 30-90s per documento medio
- Consigliato: background job o progress updates

### Sicurezza
- Validare MIME type file
- Sanitizzare filename
- Limitare dimensione upload
- Non esporre path server

### Scalabilità
- File storage: considerare S3/MinIO per produzione
- Queue: considerare Bull/Redis per job asincroni
- Cache: salvare risultati analisi nel DB
