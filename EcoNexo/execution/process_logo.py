import os
from PIL import Image, ImageDraw, ImageOps

def process_logo(input_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # 1. Determine square size (smallest dimension)
    square_size = min(width, height)
    
    # 2. Adjust based on user zoom and shift
    zoom_factor = 1.15  # Zoom in to remove black edges
    view_size = int(square_size / zoom_factor)
    
    # Calculate vertical shift (move image down = move crop up)
    y_shift = int(square_size * 0.05)
    
    # Centering coordinates for square crop
    left = (width - view_size) // 2
    top = (height - view_size) // 2 - y_shift
    right = left + view_size
    bottom = top + view_size
    
    # Ensure they are within original image bounds
    # If out of bounds, we might need to pad or adjust
    left = max(0, left)
    top = max(0, top)
    right = min(width, right)
    bottom = min(height, bottom)
    
    img_cropped = img.crop((left, top, right, bottom))
    
    # Force to a square final size
    final_size = 800
    img_square = img_cropped.resize((final_size, final_size), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (final_size, final_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, final_size, final_size), fill=255)
    
    # Apply mask
    output = img_square.copy()
    output.putalpha(mask)
    
    # 1. Variant: Transparent
    transparent_path = os.path.join(output_dir, "variant_transparent.png")
    output.save(transparent_path)
    
    # 2. Variant: Soft Green Gradient
    green_bg = Image.new('RGBA', (final_size, final_size), (240, 255, 240, 255))
    green_variant = Image.alpha_composite(green_bg, output)
    green_path = os.path.join(output_dir, "variant_green.png")
    green_variant.save(green_path)
    
    # 3. Variant: Modern White
    white_bg = Image.new('RGBA', (final_size, final_size), (255, 255, 255, 255))
    white_variant = Image.alpha_composite(white_bg, output)
    white_path = os.path.join(output_dir, "variant_white.png")
    white_variant.save(white_path)
    
    return [transparent_path, green_path, white_path]

if __name__ == "__main__":
    input_img = "/Users/santiago/.gemini/antigravity/brain/abeb3a45-22d9-4099-97a0-de4d7891b8e0/uploaded_media_1770125199653.png"
    out_dir = "/Users/santiago/.gemini/antigravity/brain/abeb3a45-22d9-4099-97a0-de4d7891b8e0/variants"
    paths = process_logo(input_img, out_dir)
    print(f"Variants generated at: {paths}")
