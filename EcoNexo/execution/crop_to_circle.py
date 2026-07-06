import sys
from PIL import Image, ImageDraw, ImageOps

def crop_to_circle(input_path, output_path):
    try:
        # Open the input image
        img = Image.open(input_path).convert("RGBA")
        
        # Determine the size for the circular crop (use the smaller dimension)
        width, height = img.size
        size = min(width, height)
        
        # Center crop to square
        left = (width - size) / 2
        top = (height - size) / 2
        right = (width + size) / 2
        bottom = (height + size) / 2
        img = img.crop((left, top, right, bottom))
        
        # Create a circular mask
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Apply the mask to the image
        output = ImageOps.fit(img, mask.size, centering=(0.5, 0.5))
        output.putalpha(mask)
        
        # Save the result
        output.save(output_path, "PNG")
        print(f"Success: Circular logo saved to {output_path}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    input_img = "/Users/santiago/.gemini/antigravity/brain/c5da332b-3e4a-430b-b87c-ca5d19cdc12e/uploaded_media_1770127875173.png"
    output_img = "/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png"
    
    # Also save a backup of the original just in case
    # run: cp public/logo-econexo.png public/logo-econexo-backup.png (handled in bash)
    
    crop_to_circle(input_img, output_img)
