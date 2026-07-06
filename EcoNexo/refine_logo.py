from PIL import Image, ImageChops
import os

target_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png'
backup_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.text.bak.png'

if os.path.exists(target_path):
    if os.path.exists(backup_path):
        os.remove(backup_path)
    # Save a copy before modifying
    import shutil
    shutil.copy2(target_path, backup_path)
    print(f"Backed up to {backup_path}")

img = Image.open(target_path).convert('RGBA')

# Create a mask of non-white pixels
# Assuming white background
bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
diff = ImageChops.difference(img, bg)
diff = ImageChops.add(diff, diff, 2.0, -100)
bbox = diff.getbbox()

if bbox:
    # Crop to content first
    content = img.crop(bbox)
    
    # Now analyze horizontal gaps to separate Icon from Text
    # We convert to grayscale and invert to get "ink" as positive
    gray = content.convert('L')
    import numpy as np
    
    # Simple histogram projection
    # 0 = black, 255 = white. 
    # We want to find rows that are fully white (gap)
    # Actually, let's just iterate rows.
    
    width, height = content.size
    rows = []
    
    # Get pixel data
    pixels = gray.load()
    
    # Find rows that are NOT all white
    # Threshold for "white" taking compression artifacts into account
    THRESHOLD = 240
    
    ink_rows = []
    for y in range(height):
        has_ink = False
        for x in range(width):
            if pixels[x, y] < THRESHOLD:
                has_ink = True
                break
        if has_ink:
            ink_rows.append(y)
            
    if not ink_rows:
        print("Error: No content found?")
        exit(1)
        
    # Analyze gaps in ink_rows
    # We expect a large gap between Icon and Text
    gaps = []
    if len(ink_rows) > 1:
        for i in range(len(ink_rows) - 1):
            gap_size = ink_rows[i+1] - ink_rows[i]
            if gap_size > 5: # Minimum gap pixels to consider as separation
                gaps.append((gap_size, ink_rows[i], ink_rows[i+1]))
    
    # Sort gaps by size, largest first
    gaps.sort(key=lambda x: x[0], reverse=True)
    
    if gaps:
        # The largest gap likely separates the Icon (top) and Text (bottom)
        # We want the top part.
        # The cut off point is the start of the gap (ink_rows[i]) 
        # Actually, the gap starts at ink_rows[i] + 1 and ends at ink_rows[i+1] - 1
        # The split point is somewhere in between.
        # We want to crop from 0 to gap_start.
        # Wait, 'ink_rows' contains indices of rows WITH ink.
        # So separation is between ink_rows[i] (last ink row of top) and ink_rows[i+1] (first ink row of bottom)
        
        largest_gap = gaps[0]
        # Check if this gap is reasonable (e.g. in the bottom half?)
        # A logo symbol is usually larger than text.
        # Let's assume the text is at the bottom.
        
        # Split y
        split_y = largest_gap[1] # This is the last row of the top block
        
        # Crop the content to keep only top block
        # bbox of content relative to img
        # We cropped 'content' from 'img' using 'bbox' earlier.
        # So we need to crop 'content' vertically from 0 to split_y + 1
        
        final_logo = content.crop((0, 0, width, split_y + 1))
        
        # Save
        final_logo.save(target_path)
        print(f"Refined logo saved to {target_path}. Removed bottom text section.")
    else:
        print("No significant vertical gap found. Maybe text is very close or not present?")
        # If no gap, maybe just save the cropped content
        content.save(target_path)
        print("Saved cropped content (no text separation found).")
        
else:
    print("Error: Image appears empty")
