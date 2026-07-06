import os

target = "[-:|]"
print(f"Scanning for exact string '{target}' ...")

for root, dirs, files in os.walk("src"):
    for file in files:
        path = os.path.join(root, file)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                if target in content:
                    print(f"FOUND MATCH in {path}")
                    # Print context
                    idx = content.find(target)
                    start = max(0, idx - 30)
                    end = min(len(content), idx + 30)
                    print(f"Context: ...{content[start:end]}...")
                    
                # Also check for variations like [:-|] or [|:-]
                # Regex character class order doesn't matter for the class name usually?
                # Actually Tailwind creates class based on exact string if arbitrary value.
                
                if "[-:\\|]" in content: # Escaped pipe
                     print(f"FOUND ESCAPED MATCH in {path}")

        except Exception as e:
            pass
