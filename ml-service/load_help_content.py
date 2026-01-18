"""
Utility to load field prompts from helpContentData.js

This module provides a function to extract aiPrompt configurations
from the JavaScript helpContentData file and convert them to Python dict.
"""

import re
import json
from pathlib import Path

def load_field_prompts_from_help_content():
    """
    Load aiPrompt configurations from helpContentData.js

    Returns:
        dict: Dictionary mapping field names to their aiPrompt configs
              Format: {
                  'fieldName': {
                      'system': 'System prompt...',
                      'instructions': 'Instructions...',
                      'style': 'Style description...'
                  }
              }
    """
    # Path to helpContentData.js (relative to ml-service folder)
    help_content_path = Path(__file__).parent.parent / 'src' / 'data' / 'helpContentData.js'

    if not help_content_path.exists():
        print(f"WARNING: helpContentData.js not found at {help_content_path}")
        return {}

    with open(help_content_path, 'r', encoding='utf-8') as f:
        content = f.read()

    field_prompts = {}

    # Match JS single-quoted strings, supporting escaped characters like \'
    js_sq = r"'((?:\\.|[^'\\])*)'"

    # Regex pattern to match aiPrompt blocks.
    # Supports both:
    # - aiPrompt: { system: '...', instructions: '...', style: '...' }
    # - aiPrompt: { system: '...', context: '...' }  (legacy)
    field_pattern = re.compile(
        rf"(\w+):\s*\{{.*?aiPrompt:\s*\{{\s*"
        rf"system:\s*{js_sq}\s*,\s*"
        rf"(?:(?:instructions|context):\s*{js_sq})\s*(?:,\s*style:\s*{js_sq})?\s*\}}",
        re.DOTALL,
    )

    matches = field_pattern.findall(content)

    for match in matches:
        # match is either (field, system, text, style) or (field, system, text)
        field_name = match[0]
        system = match[1]
        text = match[2]
        style = match[3] if len(match) > 3 and match[3] else ''

        # Unescape common JS escapes for readability in Python
        system = system.replace("\\'", "'")
        text = text.replace("\\'", "'")
        style = style.replace("\\'", "'")

        field_prompts[field_name] = {
            'system': system,
            'context': text,  # Map instructions/context to 'context' for compatibility
            'style': style
        }

    print(f"Loaded {len(field_prompts)} field prompts from helpContentData.js")
    return field_prompts

def get_field_prompt(field_name, field_prompts=None):
    """
    Get prompt configuration for a specific field

    Args:
        field_name: Name of the BEP field
        field_prompts: Optional pre-loaded prompts dict. If None, will load from file.

    Returns:
        dict: Prompt config with 'system' and 'context' keys, or default fallback
    """
    if field_prompts is None:
        field_prompts = load_field_prompts_from_help_content()

    return field_prompts.get(field_name, {
        'system': 'You are a BIM Execution Plan (BEP) expert following ISO 19650 standards.',
        'context': 'Provide professional BIM documentation content following industry best practices and ISO 19650 information management principles.'
    })

if __name__ == "__main__":
    # Test loading
    prompts = load_field_prompts_from_help_content()

    print("\nLoaded field prompts:")
    for field_name in sorted(prompts.keys()):
        print(f"  - {field_name}")

    print(f"\nTotal: {len(prompts)} fields")

    # Show example
    if 'modelValidation' in prompts:
        print("\nExample (modelValidation):")
        print(f"  System: {prompts['modelValidation']['system'][:80]}...")
        print(f"  Context: {prompts['modelValidation']['context'][:80]}...")
        print(f"  Style: {prompts['modelValidation']['style']}")
