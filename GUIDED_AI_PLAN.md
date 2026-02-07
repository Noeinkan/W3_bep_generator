# Piano: Sistema di Suggerimenti Guidati con Ollama

## Context

Attualmente il BEP Generator offre AI suggestions tramite un bottone sparkle che genera testo in modalità one-shot (l'utente clicca e Ollama genera contenuto basandosi solo sul field type). Questa funzionalità è utile ma limitata: non raccoglie informazioni specifiche sul progetto dell'utente.

**Obiettivo**: Implementare un sistema di suggerimenti interattivo dove Ollama pone domande contestuali all'utente per aiutare a comporre testi più accurati e personalizzati. L'utente può rispondere alle domande o saltarle completamente per una generazione autonoma.

**Benefit**: Testi BEP più specifici al progetto invece di contenuti generici, migliorando la qualità della documentazione.

## User Preferences (da domande)

- **UI**: Nuovo bottone separato "Guided AI" (icona wizard) accanto al bottone sparkle esistente
- **Flow**: Step-by-step (una domanda alla volta con navigazione Avanti/Indietro/Salta)
- **Generazione domande**: Completamente dinamica (Ollama genera domande da zero basandosi sul contesto)
- **Scope**: Tutti i field types con approccio generico

## Architettura della Soluzione

### Pattern: Multi-Turn Conversation

```
User clicks "Guided AI"
  ↓
Backend: Ollama genera 3-5 domande contestuali
  ↓
Frontend: Wizard step-by-step (domanda per domanda)
  ↓
User: risponde o salta domande
  ↓
Backend: Ollama genera testo incorporando le risposte
  ↓
Frontend: Preview → Replace/Append/Cancel
```

### Approccio per Domande Dinamiche

Poiché l'utente vuole domande completamente dinamiche:

1. **Prompt di generazione domande**: Ollama riceve contesto del campo (type, label, step name, altri campi compilati nello stesso step) e genera 3-5 domande rilevanti
2. **Prompt di generazione testo**: Ollama riceve le domande + risposte utente e genera contenuto che incorpora naturalmente le informazioni fornite
3. **Fallback**: Se utente salta tutte le domande → generazione autonoma (come sistema attuale)

## File Critici da Modificare/Creare

### Backend (4 file)

1. **ml-service/ollama_generator.py** (~150 righe nuove)
   - Metodo `generate_questions_for_field()` per generazione dinamica domande
   - Metodo `generate_from_answers()` per generazione testo con risposte
   - Utilizza existing `generate_text()` e prompt system

2. **ml-service/api_ollama.py** (~80 righe nuove)
   - Endpoint `POST /generate-questions`
   - Endpoint `POST /generate-from-answers`
   - Validation e error handling

3. **server/routes/ai.js** (~100 righe nuove)
   - Route `POST /api/ai/generate-questions` (proxy to ML service)
   - Route `POST /api/ai/generate-from-answers` (proxy to ML service)
   - Segue pattern esistente di altri endpoint AI

### Frontend (5 file: 1 modifica + 4 nuovi)

4. **src/components/forms/base/FieldHeader.js** (~10 righe modificate)
   - Aggiungere `GuidedAISuggestionButton` accanto ad `AISuggestionButton` esistente
   - Passare field context (step name, field metadata)

5. **src/components/forms/ai/GuidedAISuggestionButton.js** (NUOVO, ~50 righe)
   - Bottone con icona wizard (Wand2 da lucide-react)
   - onClick → apre `GuidedAISuggestionDialog`
   - Tooltip: "Guided AI - Answer questions for better content"

6. **src/components/forms/ai/GuidedAISuggestionDialog.js** (NUOVO, ~300 righe)
   - Modal principale che gestisce wizard flow
   - State management: questions, currentQuestionIndex, answers, generatedContent
   - Chiamate API: `/api/ai/generate-questions`, `/api/ai/generate-from-answers`
   - Integrazione con editor (setContent/insertContent)

7. **src/components/forms/ai/wizard/QuestionStep.js** (NUOVO, ~100 righe)
   - Visualizzazione singola domanda con textarea per risposta
   - Navigation buttons: Back, Skip, Next
   - Progress indicator: "Question 2 of 4"
   - Hint/suggestion sotto la domanda

8. **src/components/forms/ai/wizard/GenerationStep.js** (NUOVO, ~80 righe)
   - Loading state durante generazione
   - Preview del testo generato
   - Action buttons: Replace, Append, Cancel
   - Mostra numero di risposte utilizzate

## API Specifications

### Endpoint 1: Generate Questions

**Request:**
```
POST /api/ai/generate-questions
{
  field_type: string,           // e.g., "projectDescription"
  field_label: string,           // e.g., "Project Description"
  field_context: {
    step_name: string,          // e.g., "Project Information"
    step_number: number,        // e.g., 1
    existing_fields: object,    // Altri campi dello stesso step {projectType: "Commercial", ...}
    draft_id: number            // Per context addizionale se necessario
  }
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "text": "What type of building or infrastructure is this project?",
      "hint": "e.g., office building, hospital, residential, bridge..."
    },
    {
      "id": "q2",
      "text": "What is the approximate scale of the project?",
      "hint": "Area, capacity, budget range, etc."
    },
    {
      "id": "q3",
      "text": "What are the main project objectives or goals?",
      "hint": "Business drivers, sustainability targets, key challenges..."
    }
  ],
  "session_id": "uuid-12345",
  "field_type": "projectDescription"
}
```

### Endpoint 2: Generate from Answers

**Request:**
```
POST /api/ai/generate-from-answers
{
  field_type: string,
  session_id: string,
  answers: [
    { question_id: "q1", question_text: "...", answer: "15-storey office building" },
    { question_id: "q2", question_text: "...", answer: null },  // Skipped
    { question_id: "q3", question_text: "...", answer: "BREEAM Excellent, improve collaboration" }
  ],
  field_context: object  // Same as generate-questions
}
```

**Response:**
```json
{
  "success": true,
  "text": "Generated BEP content incorporating the answers...",
  "questions_answered": 2,
  "questions_total": 3,
  "model": "llama3.2:3b"
}
```

## Implementation Phases

### Phase 1: Backend Foundation (Files: 3)
**Goal**: ML service può generare domande e contenuto dalle risposte

**Tasks:**
1. Extend `ml-service/ollama_generator.py`:
   - Metodo `generate_questions_for_field(field_type, field_label, field_context)` → genera 3-5 domande
   - Metodo `generate_from_answers(field_type, answers, field_context)` → genera testo
   - Prompt engineering per question generation (critico per qualità)

2. Add FastAPI endpoints in `ml-service/api_ollama.py`:
   - `POST /generate-questions` → chiama `generate_questions_for_field`
   - `POST /generate-from-answers` → chiama `generate_from_answers`
   - Pydantic models per validation

3. Add Express proxy routes in `server/routes/ai.js`:
   - `POST /api/ai/generate-questions` → proxy to ML service
   - `POST /api/ai/generate-from-answers` → proxy to ML service
   - Timeout handling (60s per generation, 30s per questions)

**Validation**: Test con curl/Postman, verificare quality delle domande e del testo generato

---

### Phase 2: Frontend Wizard UI (Files: 4)
**Goal**: Utente può interagire con wizard guidato

**Tasks:**
1. Create `src/components/forms/ai/wizard/QuestionStep.js`:
   - Display singola domanda con numero/totale
   - Textarea per risposta (5 righe, auto-resize)
   - Hint sotto la domanda
   - Buttons: ← Back | Skip Question | Next →
   - Disabilitare Back se prima domanda

2. Create `src/components/forms/ai/wizard/GenerationStep.js`:
   - Loading spinner con messaggio "Generating content from your answers..."
   - Preview area con testo generato (scrollable)
   - Stats: "Used 2 of 4 answers"
   - Action buttons: Replace | Append | Cancel

3. Create `src/components/forms/ai/GuidedAISuggestionDialog.js`:
   - Modal con titolo "🪄 AI Content Wizard"
   - State: wizardState (questions, currentIndex, answers, isGenerating, generatedContent)
   - Render condizionale: QuestionStep vs GenerationStep
   - "Skip All Questions" button sempre visibile
   - API integration (fetch questions on mount, generate on completion)

4. Create `src/components/forms/ai/GuidedAISuggestionButton.js`:
   - Button con icona Wand2 (wizard wand)
   - Styling coerente con AISuggestionButton
   - Tooltip: "AI Content Wizard - Answer questions for tailored content"
   - Props: fieldName, fieldType, fieldLabel, editor, fieldContext

**Validation**: UI renders correttamente, navigazione funziona, state transitions corretti

---

### Phase 3: Integration (Files: 1)
**Goal**: Connettere wizard al BEP editor

**Tasks:**
1. Modify `src/components/forms/base/FieldHeader.js`:
   - Aggiungere GuidedAISuggestionButton accanto ad AISuggestionButton
   - Passare props necessari (editor, fieldName, fieldType, fieldLabel)
   - Calcolare fieldContext: step name, existing fields dello stesso step
   - Conditional rendering: mostrare solo per field types text-based (text, textarea)

**Validation**: Bottone appare nei campi corretti, context viene passato correttamente

---

### Phase 4: End-to-End Testing & Polish (Files: 2-3)
**Goal**: Sistema funziona completamente e UX è smooth

**Tasks:**
1. End-to-end flow testing:
   - Test con diversi field types (projectDescription, bimStrategy, executiveSummary, etc.)
   - Test skip scenarios (skip all, skip some, answer all)
   - Test navigation (back/forward)
   - Test error states (Ollama down, timeout, invalid response)

2. Prompt engineering refinement:
   - Iterare su prompts per question generation basandosi su output quality
   - Assicurarsi che domande siano:
     - Specifiche al campo
     - Non troppo generiche
     - Non troppo tecniche
     - Coerenti con ISO 19650 context

3. UX polish:
   - Loading states chiari con messaggi informativi
   - Error messages helpful
   - Success feedback (1.5s auto-close dopo inserimento)
   - Animations smooth per transizioni

4. Optional enhancements:
   - Save partial answers to localStorage (resume se user chiude dialog)
   - Analytics tracking (quale domande vengono skippate più spesso)

**Validation**: Flow completo funziona, testi generati sono di qualità, UX è smooth

---

## Prompt Engineering Strategy (Critico)

### Question Generation Prompt (Ollama)

```
System: You are a BIM Execution Plan (BEP) expert assistant. Your role is to help users write professional BEP content by asking them clarifying questions.

User: Generate 3-4 specific questions to help the user write content for the BEP field: "{field_label}" (type: {field_type}).

Context:
- Step: {step_name}
- Existing information: {existing_fields_summary}

Requirements:
1. Ask specific, actionable questions that will help generate better content
2. Questions should be relevant to {field_type} and ISO 19650 standards
3. Keep questions clear and concise
4. Each question should gather different information
5. Avoid yes/no questions - ask open-ended questions

Format your response as a JSON array:
[
  {"id": "q1", "text": "question text", "hint": "optional hint"},
  ...
]

Output ONLY the JSON array, no other text.
```

### Content Generation Prompt (Ollama)

```
System: You are a BIM Execution Plan (BEP) expert following ISO 19650 standards.

User: Generate professional content for the BEP field: "{field_label}" (type: {field_type}).

The user provided the following information through guided questions:
{formatted_answers}

Requirements:
1. Incorporate the user's answers naturally into professional BEP content
2. Follow ISO 19650 information management principles
3. Use appropriate technical terminology
4. Structure content clearly (paragraphs/bullets as appropriate)
5. Be specific and quantify where possible
6. Keep professional tone
7. Output ONLY the content without preambles like "Here is..." or explanations

Generate content (150-250 words):
```

## Error Handling & Edge Cases

### Backend Errors
- **Ollama down**: Return 503 con message "AI service unavailable"
- **Timeout**: Return 408 dopo 60s per generation, 30s per questions
- **Invalid JSON from Ollama**: Fallback to manual question parsing or retry
- **Model not loaded**: Auto-pull model se configured

### Frontend Errors
- **No questions returned**: Show error "Failed to generate questions" + button per retry
- **Generation fails**: Show error + allow user to try again or use quick AI
- **Network error**: Show connection error + retry button

### Edge Cases
- **All questions skipped**: Still call generate-from-answers con answers array vuoto → autonomous generation
- **Empty answers**: Trattare come skipped (answer: null)
- **Very long answer**: Truncate a 500 chars con warning
- **Dialog closed mid-wizard**: Clear state, don't persist

## Testing Strategy

### Unit Tests
- `ollama_generator.py`: Test question generation logic, answer incorporation
- `GuidedAISuggestionDialog`: Test state transitions, navigation

### Integration Tests
- Backend: Test full flow generate-questions → generate-from-answers
- Frontend: Test API calls, error handling, content insertion

### Manual QA Checklist
- [ ] Questions sono rilevanti per ogni field type testato
- [ ] Generated content incorpora le risposte in modo naturale
- [ ] Skip all questions genera comunque contenuto valido
- [ ] Replace/Append options funzionano correttamente con editor
- [ ] Back/Next navigation funziona in tutte le condizioni
- [ ] Error states mostrano messaggi chiari
- [ ] Loading states sono informativi
- [ ] Dialog è responsive (mobile/desktop)
- [ ] Keyboard navigation funziona (Tab, Enter, Esc)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Domande di bassa qualità | Alto | Iterate on prompts, add examples to system prompt, test con vari field types |
| Latency (2 API calls) | Medio | Optimize prompts per velocità, show clear loading states, cache questions se possibile |
| Context overflow (troppo context) | Basso | Limit existing_fields a same step only, summarize long values (first 100 chars) |
| User abandonment | Medio | "Skip All" button prominent, show estimated time, save progress to localStorage |
| Ollama down durante wizard | Medio | Graceful error handling, fallback to quick AI suggestion |

## Success Metrics

- **Adoption**: % di utenti che usano Guided AI vs Quick AI
- **Completion rate**: % di wizard completati vs abbandonati
- **Answer rate**: Average numero di domande risposte per session
- **Content quality**: User feedback (thumbs up/down) su generated content
- **Skip patterns**: Quali domande vengono skippate più spesso (per future ottimizzazioni)

## Future Enhancements (Post-MVP)

1. **Question templates**: Aggiungere templates in helpContentData.js per field comuni (speed + consistency)
2. **Answer suggestions**: Ollama suggerisce possibili risposte basate su existing fields
3. **Multi-language**: Supporto per domande/risposte in italiano
4. **Context learning**: ML service impara da risposte precedenti per migliorare domande future
5. **Batch wizard**: Wizard per compilare multiple fields correlati in un'unica sessione
6. **EIR integration**: Usare EIR analysis per pre-popolare alcune risposte

---

## Verification Plan

Dopo implementazione, testare:

1. **Happy path**:
   - Aprire field "Project Description"
   - Click "Guided AI" button
   - Rispondere a 3 domande generate da Ollama
   - Skip 1 domanda
   - Verificare che testo generato incorpori le 3 risposte
   - Selezionare "Replace"
   - Verificare che contenuto appaia nel TipTap editor

2. **Skip all path**:
   - Click "Guided AI"
   - Click "Skip All Questions"
   - Verificare che Ollama generi comunque testo (autonomous mode)
   - Verificare qualità del testo generato

3. **Error handling**:
   - Stop ML service
   - Click "Guided AI"
   - Verificare error message appropriato
   - Restart ML service
   - Retry e verificare successo

4. **Multiple field types**:
   - Testare con almeno 5 field types diversi:
     - projectDescription (descriptive)
     - bimStrategy (strategic)
     - modelValidation (technical)
     - cdeWorkflow (process)
     - executiveSummary (summary)
   - Verificare che domande siano appropriate per ogni tipo

5. **Navigation**:
   - Test Back button (torna a domanda precedente, risposta preservata)
   - Test Next button (avanza a domanda successiva)
   - Test Skip button (salta domanda, passa alla prossima)
   - Test Close button (chiude dialog, state viene clear)

---

## Summary

Questo piano implementa un sistema di suggerimenti AI guidati che:

1. **Genera domande dinamicamente** usando Ollama basandosi su field context
2. **Guida l'utente step-by-step** con UX chiara e navigazione intuitiva
3. **Produce contenuti personalizzati** incorporando le risposte dell'utente
4. **Fallback gracefully** a generazione autonoma se utente salta domande
5. **Si integra seamlessly** con architettura esistente (no breaking changes)

**Key Innovation**: Trasforma l'AI da "generatore passivo" a "assistente conversazionale" che intervista l'utente per capire le specifiche del progetto, producendo BEP content che riflette la realtà del progetto invece di template generici.

**Implementation Effort**: ~4 fasi, 9 file (3 backend, 5 frontend, 1 integration), stima ~20-25 ore development + testing.
