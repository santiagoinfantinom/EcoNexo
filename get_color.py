from PIL import Image
from collections import Counter

def get_dominant_color():
    img_path = "/Users/santiago/.gemini/antigravity/brain/faf1e78c-ec8d-4956-a81a-6801fe2692c3/uploaded_image_1768481232530.png"
    img = Image.open(img_path).convert("RGB")
    
    # Resize to speed up processing
    img = img.resize((100, 100))
    
    pixels = list(img.getdata())
    # Count colors
    counts = Counter(pixels)
    
    # Get most common color (background)
    most_common = counts.most_common(1)[0][0]
    
    print(f"Most common color (RGB): {most_common}")
    print(f"Hex: #{most_common[0]:02x}{most_common[1]:02x}{most_common[2]:02x}")

if __name__ == "__main__":
    get_dominant_color()
