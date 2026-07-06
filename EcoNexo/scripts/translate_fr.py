import re
import json
import os
import time
from deep_translator import GoogleTranslator

with open('src/lib/dictionaries.ts', 'r', encoding='utf-8') as f:
    text = f.read()

en_match = re.search(r'en:\s*\{(\{.*?\})\s*,\s*de:', text, re.DOTALL)
if not en_match:
    en_match = re.search(r'^\s*en:\s*\{(.*?)\n\s*},\n\s*de:\s*\{', text, re.MULTILINE | re.DOTALL)

en_block = en_match.group(1)

fr_match = re.search(r'^\s*fr:\s*\{(.*?)\n\s*},\n\s*it:\s*\{', text, re.MULTILINE | re.DOTALL)
fr_block = fr_match.group(1)
fr_end = fr_match.end(1)

pattern = re.compile(r'^\s*([a-zA-Z0-9_]+)\s*:\s*"(.*?[^\\])"\s*,?$', re.MULTILINE)

en_dict = {}
for m in pattern.finditer(en_block):
    en_dict[m.group(1)] = m.group(2)

fr_dict = {}
for m in pattern.finditer(fr_block):
    fr_dict[m.group(1)] = m.group(2)

missing_keys = [(k, v) for k, v in en_dict.items() if k not in fr_dict]

print(f"Found {len(missing_keys)} missing keys for FR.")

progress_file = "fr_progress.json"
translated_dict = {}
if os.path.exists(progress_file):
    with open(progress_file, 'r', encoding='utf-8') as f:
        translated_dict = json.load(f)

translator = GoogleTranslator(source='en', target='fr')
new_fr_lines = []

to_translate = [item for item in missing_keys if item[0] not in translated_dict]
print(f"Items left to translate: {len(to_translate)}")

batch_size = 20
try:
    for i in range(0, len(to_translate), batch_size):
        batch = to_translate[i:i+batch_size]
        values = [x[1] for x in batch]
        print(f"Translating batch {i} to {i+len(batch)}...")
        res = translator.translate_batch(values)
        for j, (k, v) in enumerate(batch):
            translated_dict[k] = res[j] if res[j] else v
        with open(progress_file, 'w', encoding='utf-8') as f:
            json.dump(translated_dict, f, ensure_ascii=False)
        time.sleep(1)
except Exception as e:
    print(f"Stopped due to error: {e}")

# Append to TS file what we have
for k, v in missing_keys:
    t_val = translated_dict.get(k, v)
    safe_tv = t_val.replace('"', '\\"') if t_val else ""
    new_fr_lines.append(f'    {k}: "{safe_tv}",')
    
inserted_text = "\n" + "\n".join(new_fr_lines) + "\n"
new_text = text[:fr_end] + inserted_text + text[fr_end:]

with open('src/lib/dictionaries.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated dictionaries.ts!")
