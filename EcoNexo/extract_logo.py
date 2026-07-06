from PIL import Image
import os

source_path = '/Users/santiago/.gemini/antigravity/brain/fa6bf00f-0f69-42cb-963a-553533b757a2/logo_concept_sheet_1_1768817347552.png'
dest_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png'
backup_path = '/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.bak.png'

# Backup existing
if os.path.exists(dest_path):
    if os.path.exists(backup_path):
        os.remove(backup_path)
    os.rename(dest_path, backup_path)
    print(f"Backed up to {backup_path}")

img = Image.open(source_path)
width, height = img.size

# Assuming 5 logos in 3 (top) + 2 (bottom) layout
# Logo 5 is bottom right.
# Crop box: (left, upper, right, lower)
# Bottom half: y from height//2 to height
# Right half of bottom: x from width//2 to width

# Let's add some margin crop if needed, but strict quadrant is safest start
crop_box = (width // 2, height // 2, width, height)

# However, often there is whitespace.
# Let's crop the quadrant first
logo_quadrant = img.crop(crop_box)

# Now, let's auto-crop whitespace from this quadrant
bbox = logo_quadrant.getbbox()
if bbox:
    logo_final = logo_quadrant.crop(bbox)
    # Add a little padding back? 
    # Maybe expand the canvas a bit to make it square if needed, or keep as is.
    # For now, raw crop is fine.
    # Actually, let's keep it simply square if possible for logos?
    # No, just save the cropped content.
    logo_final.save(dest_path)
    print(f"Saved extracted logo 5 to {dest_path}")
else:
    print("Error: Empty content in logo 5 quadrant")
