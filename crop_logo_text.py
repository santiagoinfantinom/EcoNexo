from PIL import Image
import os

try:
    # Open the image
    img = Image.open("public/logo-new.png")
    width, height = img.size
    print(f"Original size: {width}x{height}")

    # Crop the bottom 25% where the text usually is
    # Adjust this percentage if needed based on visual estimation
    new_height = int(height * 0.75)
    
    # Crop: (left, top, right, bottom)
    cropped_img = img.crop((0, 0, width, new_height))
    
    # Save as new logo
    cropped_img.save("public/logo-no-text.png")
    print(f"Saved cropped image to public/logo-no-text.png (Size: {width}x{new_height})")

except Exception as e:
    print(f"Error: {e}")
