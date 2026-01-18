"""
Ollama Verification Script
Verifies that Ollama is installed, running, and ready to use with BEP Generator
"""

import requests
import json
import sys
import time
from typing import Dict, List, Optional

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.END}\n")

def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_info(text: str):
    """Print info message"""
    print(f"{Colors.CYAN}ℹ️  {text}{Colors.END}")

def check_ollama_running(base_url: str = "http://localhost:11434") -> bool:
    """Check if Ollama service is running"""
    print_header("🔍 STEP 1: Verifica Servizio Ollama")

    try:
        response = requests.get(f"{base_url}/api/tags", timeout=5)
        if response.status_code == 200:
            print_success(f"Ollama è in esecuzione su {base_url}")
            return True
        else:
            print_error(f"Ollama risponde ma con errore: HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Impossibile connettersi a Ollama")
        print_info("Assicurati che Ollama sia installato e in esecuzione")
        print_info("Windows: Cerca 'Ollama' nel menu Start")
        print_info("Linux/Mac: Esegui 'ollama serve' in un terminale")
        return False
    except Exception as e:
        print_error(f"Errore nella verifica: {e}")
        return False

def get_installed_models(base_url: str = "http://localhost:11434") -> List[Dict]:
    """Get list of installed models"""
    print_header("📦 STEP 2: Modelli Installati")

    try:
        response = requests.get(f"{base_url}/api/tags", timeout=5)
        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])

            if models:
                print_success(f"Trovati {len(models)} modelli installati:")
                print()
                for model in models:
                    name = model.get('name', 'unknown')
                    size_bytes = model.get('size', 0)
                    size_gb = size_bytes / (1024**3) if size_bytes else 0
                    modified = model.get('modified_at', 'unknown')

                    print(f"  📊 {Colors.BOLD}{name}{Colors.END}")
                    print(f"     Dimensione: {size_gb:.2f} GB")
                    print(f"     Modificato: {modified}")
                    print()

                return models
            else:
                print_warning("Nessun modello installato")
                print_info("Scarica un modello con: ollama pull llama3.2:3b")
                return []
        else:
            print_error(f"Errore nel recupero modelli: HTTP {response.status_code}")
            return []
    except Exception as e:
        print_error(f"Errore: {e}")
        return []

def check_recommended_model(models: List[Dict], recommended: str = "llama3.2:3b") -> bool:
    """Check if recommended model is installed"""
    print_header("🎯 STEP 3: Modello Raccomandato")

    model_names = [m.get('name', '') for m in models]

    # Check exact match
    if recommended in model_names:
        print_success(f"Modello raccomandato '{recommended}' è installato")
        return True

    # Check partial match (e.g., llama3.2 in llama3.2:3b-q4_0)
    base_model = recommended.split(':')[0] if ':' in recommended else recommended
    partial_matches = [m for m in model_names if base_model in m]

    if partial_matches:
        print_warning(f"Modello base '{base_model}' trovato: {partial_matches[0]}")
        print_info("Questo modello dovrebbe funzionare, ma è raccomandato: " + recommended)
        return True

    print_error(f"Modello raccomandato '{recommended}' NON installato")
    print_info(f"Scaricalo con: ollama pull {recommended}")
    print()
    print_info("Modelli alternativi:")
    print("  • llama3.2:1b  - Più veloce, ottima qualità (2GB)")
    print("  • mistral:7b   - Migliore qualità, più lento (4GB)")

    return False

def test_generation(base_url: str = "http://localhost:11434", model: str = "llama3.2:3b") -> bool:
    """Test text generation"""
    print_header("🚀 STEP 4: Test Generazione Testo")

    prompt = "Write a one-sentence executive summary for a BIM project."

    print_info(f"Test con modello: {model}")
    print_info(f"Prompt: {prompt}")
    print()

    try:
        start_time = time.time()

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 100
            }
        }

        print_info("Invio richiesta a Ollama... (può richiedere alcuni secondi)")

        response = requests.post(
            f"{base_url}/api/generate",
            json=payload,
            timeout=60
        )

        elapsed_time = time.time() - start_time

        if response.status_code == 200:
            data = response.json()
            generated_text = data.get('response', '').strip()

            print_success(f"Generazione completata in {elapsed_time:.2f} secondi")
            print()
            print(f"{Colors.BOLD}Testo generato:{Colors.END}")
            print(f"{Colors.CYAN}{generated_text}{Colors.END}")
            print()

            # Check quality indicators
            if len(generated_text) > 20:
                print_success("La risposta ha una lunghezza adeguata")
            else:
                print_warning("La risposta è molto breve, potrebbe essere un problema")

            return True
        else:
            print_error(f"Errore nella generazione: HTTP {response.status_code}")
            print_error(response.text)
            return False

    except requests.exceptions.Timeout:
        print_error("Timeout nella generazione (>60s)")
        print_info("Il modello potrebbe essere troppo lento per il tuo hardware")
        print_info("Prova un modello più leggero: ollama pull llama3.2:1b")
        return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def test_api_compatibility(base_url: str = "http://localhost:11434") -> bool:
    """Test API endpoints needed by BEP Generator"""
    print_header("🔌 STEP 5: Test Compatibilità API")

    endpoints = [
        ("/api/tags", "GET", None),
        ("/api/generate", "POST", {"model": "llama3.2:3b", "prompt": "test", "stream": False}),
    ]

    all_ok = True

    for endpoint, method, payload in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
            else:
                response = requests.post(f"{base_url}{endpoint}", json=payload, timeout=30)

            if response.status_code in [200, 404]:  # 404 is ok for model not found
                print_success(f"{method} {endpoint}: OK")
            else:
                print_warning(f"{method} {endpoint}: HTTP {response.status_code}")
                all_ok = False
        except Exception as e:
            print_error(f"{method} {endpoint}: {e}")
            all_ok = False

    return all_ok

def print_summary(checks: Dict[str, bool]):
    """Print final summary"""
    print_header("📊 RIEPILOGO VERIFICA")

    all_passed = all(checks.values())

    for check_name, passed in checks.items():
        if passed:
            print_success(check_name)
        else:
            print_error(check_name)

    print()
    print("="*70)

    if all_passed:
        print()
        print(f"{Colors.BOLD}{Colors.GREEN}🎉 TUTTI I TEST SUPERATI!{Colors.END}")
        print()
        print_success("Ollama è configurato correttamente e pronto all'uso")
        print_info("Puoi avviare il BEP Generator con: npm start")
        print()
    else:
        print()
        print(f"{Colors.BOLD}{Colors.YELLOW}⚠️  ALCUNI TEST FALLITI{Colors.END}")
        print()
        print_warning("Risolvi i problemi sopra prima di procedere")
        print_info("Consulta la documentazione: docs/OLLAMA_SETUP.md")
        print()

    print("="*70)

    return all_passed

def main():
    """Main verification routine"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}")
    print("╔═══════════════════════════════════════════════════════════════════╗")
    print("║                                                                   ║")
    print("║          OLLAMA VERIFICATION TOOL - BEP Generator                 ║")
    print("║                                                                   ║")
    print("╚═══════════════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")

    base_url = "http://localhost:11434"
    recommended_model = "llama3.2:3b"

    # Run checks
    checks = {}

    # 1. Check if Ollama is running
    checks["Servizio Ollama in esecuzione"] = check_ollama_running(base_url)

    if not checks["Servizio Ollama in esecuzione"]:
        print_summary(checks)
        sys.exit(1)

    # 2. Get installed models
    models = get_installed_models(base_url)
    checks["Almeno un modello installato"] = len(models) > 0

    # 3. Check recommended model
    checks["Modello raccomandato installato"] = check_recommended_model(models, recommended_model)

    # 4. Test generation (only if recommended model exists)
    if checks["Modello raccomandato installato"]:
        checks["Generazione testo funzionante"] = test_generation(base_url, recommended_model)
    else:
        # Try with first available model
        if models:
            first_model = models[0].get('name', '')
            print_info(f"Test con primo modello disponibile: {first_model}")
            checks["Generazione testo funzionante"] = test_generation(base_url, first_model)
        else:
            checks["Generazione testo funzionante"] = False

    # 5. Test API compatibility
    checks["API REST compatibili"] = test_api_compatibility(base_url)

    # Print summary
    all_passed = print_summary(checks)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
