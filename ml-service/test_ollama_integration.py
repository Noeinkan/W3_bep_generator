"""
Simple integration test for Ollama-based BEP Generator
Tests the complete flow from API to Ollama
"""

import requests
import time
import sys


def test_ollama_service():
    """Test that Ollama service is running"""
    print("="*70)
    print("TEST 1: Ollama Service")
    print("="*70)

    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            data = response.json()
            models = [m.get('name') for m in data.get('models', [])]
            print(f"✅ Ollama is running")
            print(f"📦 Available models: {', '.join(models)}")
            return True
        else:
            print(f"❌ Ollama returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("   Make sure Ollama is running (ollama serve)")
        return False


def test_ml_api_health():
    """Test ML API health endpoint"""
    print("\n" + "="*70)
    print("TEST 2: ML API Health Check")
    print("="*70)

    try:
        response = requests.get("http://localhost:5003/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ML API is healthy")
            print(f"   Status: {data.get('status')}")
            print(f"   Ollama Connected: {data.get('ollama_connected')}")
            print(f"   Model: {data.get('model')}")
            print(f"   Backend: {data.get('backend')}")
            return data.get('ollama_connected', False)
        else:
            print(f"❌ ML API returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to ML API: {e}")
        print("   Make sure ML service is running (npm run start:ml)")
        return False


def test_text_generation():
    """Test text generation endpoint"""
    print("\n" + "="*70)
    print("TEST 3: Text Generation")
    print("="*70)

    payload = {
        "prompt": "This BIM project aims to",
        "field_type": "executiveSummary",
        "max_length": 150,
        "temperature": 0.7
    }

    print(f"📝 Prompt: {payload['prompt']}")
    print(f"🎯 Field Type: {payload['field_type']}")
    print("⏳ Generating... (this may take a few seconds)")

    try:
        start_time = time.time()
        response = requests.post(
            "http://localhost:5003/generate",
            json=payload,
            timeout=60
        )
        elapsed = time.time() - start_time

        if response.status_code == 200:
            data = response.json()
            generated = data.get('text', '')
            model = data.get('model', '')

            print(f"✅ Generation successful")
            print(f"⏱️  Time: {elapsed:.2f} seconds")
            print(f"🤖 Model: {model}")
            print(f"📊 Length: {len(generated)} characters")
            print(f"\n📄 Generated Text:")
            print("-"*70)
            print(generated)
            print("-"*70)
            return True
        else:
            print(f"❌ Generation failed: HTTP {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Generation error: {e}")
        return False


def test_field_suggestion():
    """Test field-specific suggestion endpoint"""
    print("\n" + "="*70)
    print("TEST 4: Field Suggestion")
    print("="*70)

    payload = {
        "field_type": "projectObjectives",
        "partial_text": "The main objectives are to",
        "max_length": 200
    }

    print(f"📝 Partial Text: {payload['partial_text']}")
    print(f"🎯 Field Type: {payload['field_type']}")
    print("⏳ Generating suggestion...")

    try:
        start_time = time.time()
        response = requests.post(
            "http://localhost:5003/suggest",
            json=payload,
            timeout=60
        )
        elapsed = time.time() - start_time

        if response.status_code == 200:
            data = response.json()
            suggestion = data.get('text', '')

            print(f"✅ Suggestion successful")
            print(f"⏱️  Time: {elapsed:.2f} seconds")
            print(f"📊 Length: {len(suggestion)} characters")
            print(f"\n💡 Suggested Completion:")
            print("-"*70)
            print(suggestion)
            print("-"*70)
            return True
        else:
            print(f"❌ Suggestion failed: HTTP {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Suggestion error: {e}")
        return False


def test_available_models():
    """Test models listing endpoint"""
    print("\n" + "="*70)
    print("TEST 5: Available Models")
    print("="*70)

    try:
        response = requests.get("http://localhost:5003/models", timeout=5)
        if response.status_code == 200:
            data = response.json()
            current = data.get('current_model')
            available = data.get('available_models', [])

            print(f"✅ Models endpoint working")
            print(f"🎯 Current Model: {current}")
            print(f"📦 Available Models: {len(available)}")
            for model in available:
                print(f"   • {model}")
            return True
        else:
            print(f"❌ Models endpoint failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Models endpoint error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n")
    print("╔═══════════════════════════════════════════════════════════════════╗")
    print("║                                                                   ║")
    print("║          Ollama Integration Test - BEP Generator                 ║")
    print("║                                                                   ║")
    print("╚═══════════════════════════════════════════════════════════════════╝")
    print()

    results = {}

    # Run tests
    results['Ollama Service'] = test_ollama_service()
    results['ML API Health'] = test_ml_api_health()

    # Only continue if basic tests pass
    if not results['Ollama Service']:
        print("\n❌ Ollama is not running. Please start it first.")
        print("   Run: ollama serve")
        sys.exit(1)

    if not results['ML API Health']:
        print("\n❌ ML API is not running. Please start it first.")
        print("   Run: npm run start:ml")
        sys.exit(1)

    # Run generation tests
    results['Text Generation'] = test_text_generation()
    results['Field Suggestion'] = test_field_suggestion()
    results['Models Listing'] = test_available_models()

    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:12} | {test_name}")

    print("="*70)
    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! Ollama integration is working correctly.")
        print("\n✅ You can now:")
        print("   1. Start the full app: npm start")
        print("   2. Open http://localhost:3000")
        print("   3. Use AI generation in the BEP editor")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
