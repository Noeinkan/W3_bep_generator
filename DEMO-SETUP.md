# 🚀 BEP Generator - Demo Setup con Cloudflare Tunnel

Questa guida ti mostra come esporre la tua app BEP Generator online per demo e testing, mantenendola in esecuzione sul tuo PC locale.

## 📋 Prerequisiti

Prima di iniziare la demo, assicurati di avere:

### 1. ✅ Cloudflared installato
Cloudflared è già stato installato! Se dovessi reinstallarlo:
```bash
winget install --id Cloudflare.cloudflared
```

### 2. ✅ Ollama installato e configurato
Il servizio AI richiede Ollama con il modello llama3.2:3b.

**Verifica che Ollama sia in esecuzione:**
```bash
# Controlla se Ollama è attivo
curl http://localhost:11434/api/tags
```

Se ottieni un errore, avvia Ollama:
```bash
# Avvia Ollama (di solito si avvia automaticamente)
ollama serve
```

**Verifica che il modello sia installato:**
```bash
# Lista modelli installati
ollama list

# Se llama3.2:3b non c'è, installalo:
ollama pull llama3.2:3b
```

### 3. ✅ Dipendenze Node.js
```bash
npm install
cd server && npm install && cd ..
```

### 4. ✅ Dipendenze Python (ML Service)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🎬 Avvio Rapido della Demo

### Opzione 1: SUPER RAPIDO - Tutto in un comando! ⚡ (CONSIGLIATO)

Basta un solo comando:
```bash
npm start
```

Questo avvierà AUTOMATICAMENTE:
1. ✅ Frontend (React - porta 3000)
2. ✅ Backend (Node.js - porta 3001)
3. ✅ ML service (Python + Ollama - porta 8000)
4. ✅ **Cloudflare Tunnel** per l'app principale (dopo 15 secondi)

**Cerca nell'output l'URL del tunnel:**
```
[Tunnel] 🚀 TUNNEL ATTIVO! Copia questo URL:
[Tunnel]    https://magical-unicorn-abc123.trycloudflare.com
```

**Copia quell'URL e condividilo!** Il tunnel espone il frontend su porta 3000, e il backend (con AI) è accessibile tramite il proxy React.

### Opzione 2: Solo il tunnel (se i servizi sono già avviati)

Se hai già avviato l'app e vuoi solo creare un nuovo tunnel:
```bash
npm run tunnel
```

---

## 🌐 Condivisione dell'URL

Una volta avviato il tunnel, vedrai un URL tipo:
```
https://random-name-1234.trycloudflare.com
```

**Questo URL è:**
- ✅ Pubblicamente accessibile da chiunque
- ✅ Protetto da HTTPS automaticamente
- ✅ Valido finché il tunnel è attivo
- ⚠️ Cambia ogni volta che riavvii il tunnel

**Condividi questo URL con:**
- Clienti per demo
- Tester
- Stakeholder del progetto

---

## 🧪 Verifica che tutto funzioni

### 1. Test locale (prima di condividere)
Apri nel browser: http://localhost:3000 (frontend) o http://localhost:3001 (backend diretto)

### 2. Test servizio AI
Apri: http://localhost:8000/docs

Dovresti vedere la documentazione FastAPI del servizio ML.

### 3. Test tunnel pubblico
Apri l'URL Cloudflare generato nel browser. Il tunnel punta al frontend (porta 3000), che comunica con il backend (porta 3001) tramite proxy.

### 4. Test funzionalità AI nell'app
1. Crea un nuovo BEP
2. In un campo di testo, inizia a scrivere
3. Dovresti vedere suggerimenti AI (se configurato nell'UI)

---

## ⏸️ Stop della Demo

1. **Premi `Ctrl+C`** nel terminale dove hai lanciato `npm start`
2. Tutti i servizi (frontend, backend, ML service, tunnel) si fermeranno automaticamente

---

## 🔧 Troubleshooting

### ❌ Problema: "cloudflared: command not found"

**Soluzione:**
```bash
# Reinstalla cloudflared
winget install --id Cloudflare.cloudflared

# Oppure riavvia il terminale
```

### ❌ Problema: "Cannot connect to Ollama"

**Verifica:**
```bash
# 1. Ollama è in esecuzione?
curl http://localhost:11434/api/tags

# 2. Modello installato?
ollama list

# 3. Riavvia Ollama se necessario
ollama serve
```

**Se Ollama non è disponibile:**
L'app funzionerà comunque, ma senza suggerimenti AI.

### ❌ Problema: "Port 3001 already in use"

**Soluzione:**
```bash
# Trova il processo sulla porta 3001
netstat -ano | findstr :3001

# Termina il processo (sostituisci PID con l'ID del processo)
taskkill /PID <PID> /F
```

### ❌ Problema: PDF generation fallisce

**Verifica:**
- Hai abbastanza RAM disponibile? (Puppeteer richiede ~500MB)
- Il backend è avviato correttamente?
- Controlla i log del server per errori Puppeteer

### ❌ Problema: Il tunnel si disconnette dopo ~2 ore

**Questo è normale** - i Quick Tunnel hanno un timeout di inattività.

**Soluzione:**
- Riavvia il tunnel con `cloudflared tunnel --url http://localhost:3001`
- L'app continuerà a funzionare localmente

---

## 📊 Limitazioni della Demo

### Quick Tunnel (gratuito):
- ⏱️ **Timeout**: ~2 ore di inattività
- 🔄 **URL cambia**: Ogni volta che riavvii
- 🌐 **Bandwidth**: Illimitata (uso ragionevole)
- 👥 **Utenti**: Illimitati (pensato per dev/testing)

### Performance:
- 💾 **Database**: SQLite locale (buono per demo, limitato per produzione)
- 🖼️ **PDF**: Generati sul tuo PC (performance dipendono dal tuo hardware)
- 🤖 **AI**: Ollama locale (velocità dipende dal tuo CPU/GPU)

---

## 🎯 Best Practices per Demo

### Prima di una demo programmata:

1. **10 minuti prima:**
   ```bash
   # Test che tutto funzioni localmente
   npm start
   ```

2. **5 minuti prima:**
   ```bash
   # Crea il tunnel
   cloudflared tunnel --url http://localhost:3001
   ```

3. **3 minuti prima:**
   - Copia l'URL
   - Testalo tu stesso
   - Manda l'URL al cliente

### Durante la demo:
- Tieni aperta la finestra del tunnel (non chiuderla!)
- Monitora i log per eventuali errori
- Tieni un browser aperto sulla tua istanza locale per debug

### Dopo la demo:
- Stop del tunnel (`Ctrl+C`)
- Stop dell'app (se non serve più)
- Salva il database se hai dati di test importanti

---

## 🚀 Upgrade a Tunnel Permanente (Opzionale)

Se fai demo frequenti e vuoi un URL fisso:

### 1. Login a Cloudflare (account gratuito)
```bash
cloudflared tunnel login
```

### 2. Crea un Named Tunnel
```bash
cloudflared tunnel create bep-demo
```

### 3. Configura il tunnel
Crea file: `C:\Users\andre\.cloudflared\config.yml`

```yaml
tunnel: bep-demo
credentials-file: C:\Users\andre\.cloudflared\<tunnel-id>.json

ingress:
  - hostname: bep.tuodominio.com  # Serve un tuo dominio
    service: http://localhost:3001
  - service: http_status:404
```

### 4. Avvia il tunnel permanente
```bash
cloudflared tunnel run bep-demo
```

**Vantaggi:**
- ✅ URL fisso (usa il tuo dominio)
- ✅ Più professionale
- ✅ Configurazione persistente

**Svantaggi:**
- ⚠️ Richiede un dominio personale
- ⚠️ Setup più complesso

---

## 📝 Architettura Semplificata

La configurazione attuale usa **UN SOLO tunnel Cloudflare** che espone il frontend (porta 3000):

```
Internet → Cloudflare Tunnel (porta 3000) → React Frontend
                                             ↓ (proxy)
                                          Backend (porta 3001)
                                             ↓
                                          ML Service (porta 8000)
                                             ↓
                                          Ollama (porta 11434)
```

Il frontend React ha un proxy configurato in [package.json](package.json:5) (`"proxy": "http://localhost:3001"`) che inoltra le richieste API al backend. Il backend poi comunica con il servizio ML, che a sua volta comunica con Ollama.

**Nota:** Non serve esporre separatamente il servizio ML perché il backend fa da intermediario.

---

## 📞 Supporto

Se hai problemi:
1. Controlla la sezione [Troubleshooting](#-troubleshooting)
2. Verifica i log del server
3. Controlla che Ollama sia attivo
4. Riavvia tutto e riprova

---

## ✨ Cosa include la demo

Quando condividi l'URL Cloudflare Tunnel, gli utenti avranno accesso a:

### Funzionalità complete:
- ✅ Creazione BEP
- ✅ Gestione TIDP/MIDP
- ✅ Editor rich text (TipTap)
- ✅ Diagrammi interattivi
- ✅ Export PDF (con Puppeteer)
- ✅ Suggerimenti AI (con Ollama)
- ✅ Sistema di draft
- ✅ Database persistente (finché il PC è acceso)

### Cosa vedranno:
- Interfaccia completa dell'app
- Performance reale del tuo sistema
- Tutte le funzionalità AI attive

---

**Pronto per la demo? Lancia `start-demo.bat` e sei online! 🚀**
