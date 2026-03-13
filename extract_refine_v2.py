from PIL import Image
import os

source_path = '/Users/santiago/.gemini/antigravity/brain/fa6bf00f-0f69-42cb-963a-553533b757a2/logo_concept_sheet_1_1768817347552.png'
dest_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png'

def find_intervals(data, threshold=240, min_size=10):
    intervals = []
    in_interval = False
    start = 0
    for i, val in enumerate(data):
        is_ink = val < threshold
        if is_ink and not in_interval:
            in_interval = True
            start = i
        elif not is_ink and in_interval:
            in_interval = False
            if i - start >= min_size:
                intervals.append((start, i))
    if in_interval and (len(data) - start >= min_size):
        intervals.append((start, len(data)))
    return intervals

img = Image.open(source_path).convert('L')
width, height = img.size

# 1. Horizontal Projection
row_has_ink = []
pixels = img.load()
for y in range(height):
    has_ink = False
    for x in range(width):
        if pixels[x, y] < 240:
            has_ink = True
            break
    row_has_ink.append(0 if has_ink else 255)

row_intervals = find_intervals(row_has_ink)
print(f"Detected {len(row_intervals)} rows of content.")

# Filter rows by height to ignore text lines
# Logos are likely > 100px. Text labels are ~45px based on previous run.
logo_rows = [r for r in row_intervals if (r[1] - r[0]) > 80]
print(f"Filtered to {len(logo_rows)} graphic rows.")

real_logos = []

for r_start, r_end in logo_rows:
    strip = img.crop((0, r_start, width, r_end))
    w, h = strip.size
    pix = strip.load()
    
    col_has_ink = []
    for x in range(w):
        has_ink = False
        for y in range(h):
            if pix[x, y] < 240:
                has_ink = True
                break
        col_has_ink.append(0 if has_ink else 255)
        
    col_intervals = find_intervals(col_has_ink, min_size=10)
    print(f"  Row {r_start}-{r_end}: Detected {len(col_intervals)} items.")
    
    for c_start, c_end in col_intervals:
        logo_box = (c_start, r_start, c_end, r_end)
        real_logos.append(logo_box)

print(f"Total REAL logos found: {len(real_logos)}")

if len(real_logos) >= 5:
    target_box = real_logos[4] # Index 4 is the 5th logo
    print(f"Target Logo 5 Box: {target_box}")
    
    # Crop original color image
    color_img = Image.open(source_path).convert('RGBA')
    logo_crop = color_img.crop(target_box)
    
    # Since we likely excluded the text row by filtering, 
    # the crop should contain ONLY the graphic symbol.
    
    # Optional: Trim whitespace from the result
    content_box = logo_crop.getbbox()
    if content_box:
        logo_final = logo_crop.crop(content_box)
    else:
        logo_final = logo_crop
        
    logo_final.save(dest_path)
    print(f"Saved refined logo to {dest_path}")
    
else:
    print("Error: Could not find 5 logos after filtering.")
