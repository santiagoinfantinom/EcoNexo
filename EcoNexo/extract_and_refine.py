from PIL import Image, ImageOps
import os

source_path = '/Users/santiago/.gemini/antigravity/brain/fa6bf00f-0f69-42cb-963a-553533b757a2/logo_concept_sheet_1_1768817347552.png'
dest_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png'

# Helper to find intervals of non-white pixels
def find_intervals(data, threshold=240, min_size=10):
    # data is a list of brightness values (or boolean is_ink)
    # returns list of (start, end)
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

# 1. Horizontal Projection to find Rows
# Sum of 255-pixel value for each row? Or just "has any ink"?
# Has any ink is safer for clean vectors.
row_has_ink = []
pixels = img.load()
for y in range(height):
    has_ink = False
    for x in range(width):
        if pixels[x, y] < 240:
            has_ink = True
            break
    row_has_ink.append(0 if has_ink else 255)

# Invert for intervals: 0 is ink (detected as < 240 above, so logic: 0 means HAS ink in find_intervals if we pass raw vals? 
# Wait, find_intervals checks 'val < threshold'. 
# So if I pass 0 for ink, 0 < 240 is TRUE. Correct.
row_intervals = find_intervals(row_has_ink)

print(f"Detected {len(row_intervals)} rows of logos.")

logos = []

for r_start, r_end in row_intervals:
    # 2. Vertical Projection for this row to find Columns
    # Crop the row strip
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
        
    col_intervals = find_intervals(col_has_ink)
    print(f"  Row {r_start}-{r_end}: Detected {len(col_intervals)} logos.")
    
    for c_start, c_end in col_intervals:
        # Extract logo box
        logo_box = (c_start, r_start, c_end, r_end)
        logos.append(logo_box)

print(f"Total logos found: {len(logos)}")

if len(logos) >= 5:
    target_box = logos[4] # Index 4 is the 5th logo
    print(f"Target Logo 5 Box: {target_box}")
    
    # Crop original color image
    color_img = Image.open(source_path).convert('RGBA')
    logo_crop = color_img.crop(target_box)
    
    # 3. Remove Text (Analyze vertical gaps in the cropped logo)
    # Convert crop to grayscale for analysis
    gray_crop = logo_crop.convert('L')
    cw, ch = gray_crop.size
    cpix = gray_crop.load()
    
    # Vertical projection of the crop (row-wise ink again)
    crop_row_ink = []
    for y in range(ch):
        has_ink = False
        for x in range(cw):
            if cpix[x,y] < 240:
                has_ink = True
                break
        crop_row_ink.append(0 if has_ink else 255)
        
    # Find components in the crop vertically
    components = find_intervals(crop_row_ink, min_size=2)
    # Usually: Icon is the top component(s), Text is the bottom component.
    # If text lines are multiple components?
    # Largest gap usually separates Icon and Text.
    
    if len(components) > 1:
        # Find the largest vertical gap between components
        max_gap = 0
        split_y = ch
        
        # Check gaps between consecutive components
        for i in range(len(components) - 1):
            gap = components[i+1][0] - components[i][1]
            if gap > max_gap:
                max_gap = gap
                # Split is at end of top component
                split_y = components[i][1]
                
        # If max gap is significant (e.g. > 5px), assume it separates icon and text
        if max_gap > 5:
            print(f"Found gap of {max_gap}px. cropping text at y={split_y}")
            # Refine crop height
            # But wait, 'split_y' is relative to the cropped box.
            # We crop the 'logo_crop'.
            logo_final = logo_crop.crop((0, 0, cw, split_y))
        else:
            logo_final = logo_crop
    else:
        logo_final = logo_crop
        
    # Final trim of whitespace around the result?
    # bbox = logo_final.getbbox()
    # if bbox: logo_final = logo_final.crop(bbox)
        
    logo_final.save(dest_path)
    print(f"Saved refined logo to {dest_path}")
    
else:
    print("Error: Could not find 5 logos.")
