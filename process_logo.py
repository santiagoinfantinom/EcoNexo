from PIL import Image
import numpy as np

def closest_color_swap():
    img_path = "/Users/santiago/Documents/Projects/EcoNexo/public/logo_original.png"
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)

    # Separate channels
    r, g, b, a = data.T.astype(np.float32)

    # Define Colors
    # Average "Blue" from original (cyan-ish)
    ref_blue = np.array([50, 150, 250]) 
    # Average "Green" from original (mint-ish)
    ref_green = np.array([50, 200, 150])
    
    # Target Colors
    target_black = np.array([0, 0, 0, 255])
    target_sour_apple = np.array([219, 245, 142, 255]) # #DBF58E
    
    # Define Background Threshold (White)
    # If a pixel is very bright/white, make it transparent
    white_threshold = 240
    is_background = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)
    
    # For non-background pixels, decide if they are closer to Blue or Green
    # Calculate squared euclidean distance to Ref Blue and Ref Green
    # (R-R0)^2 + (G-G0)^2 + (B-B0)^2
    
    dist_blue = (r - ref_blue[0])**2 + (g - ref_blue[1])**2 + (b - ref_blue[2])**2
    dist_green = (r - ref_green[0])**2 + (g - ref_green[1])**2 + (b - ref_green[2])**2
    
    # Create masks
    is_blue_component = (dist_blue < dist_green) & (~is_background)
    is_green_component = (dist_green <= dist_blue) & (~is_background)
    
    # Apply substitutions
    # We update the original 'data' array which is uint8
    
    # Make background transparent
    data[..., 3][is_background] = 0 
    
    # Turn "Blue" parts to Black
    data[is_blue_component] = target_black
    
    # Turn "Green" parts to Sour Apple
    data[is_green_component] = target_sour_apple
    
    # Save
    new_img = Image.fromarray(data)
    new_img.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_recolored_clean.png")
    print("Clean processed image saved to logo_recolored_clean.png")

if __name__ == "__main__":
    closest_color_swap()
