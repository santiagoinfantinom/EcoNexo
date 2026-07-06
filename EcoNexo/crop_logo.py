from PIL import Image
import numpy as np

def crop_text():
    # Load the flipped logo which is currently the main one
    img_path = "/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png"
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    
    # Get alpha channel
    alpha = data[..., 3]
    
    # Find non-transparent rows
    non_empty_rows = np.where(np.any(alpha > 0, axis=1))[0]
    
    if len(non_empty_rows) == 0:
        print("Image is empty")
        return

    top_bound = non_empty_rows[0]
    bottom_bound = non_empty_rows[-1]
    
    print(f"Content range: {top_bound} to {bottom_bound}")
    
    # Analyze vertical profile to find the gap between Logo and Text
    # We expect a gap of empty rows (or low density)
    
    # Let's count non-zero pixels per row
    pixel_counts = np.count_nonzero(alpha > 0, axis=1)
    
    # Search for a gap in the bottom half (assuming text is at bottom)
    # We look for a sequence of 0s (or very low counts) after a high count
    
    # Heuristic: The split is likely in the bottom 40% of the content
    search_start = top_bound + int((bottom_bound - top_bound) * 0.6)
    
    # Find the largest gap in the search region
    # actually, simpler: The text is usually a separate block.
    # Let's scan from search_start downwards for a transition from Empty -> Content (Top of text)
    # OR from Content -> Empty (Bottom of Logo)
    
    found_cut = False
    cut_y = bottom_bound # Default to no cut
    
    # Detect the gap
    # Iterate from bottom up. First we should see Text (Content), then Gap (Empty), then Logo (Content)
    
    # 1. Start from bottom, find text end (already bottom_bound)
    # 2. Find text start (scan up until empty)
    
    current_y = bottom_bound
    
    # Scan up to find where text area ends (i.e., finding the gap)
    in_content = True
    gap_found = False
    
    for y in range(bottom_bound, search_start, -1):
        has_pixels = pixel_counts[y] > 5 # threshold for "content"
        
        if in_content and not has_pixels:
            # We just left the text block and entered the gap
            in_content = False
            gap_found = True
            cut_y = y
            print(f"Found gap at y={y}")
            break
            
    if gap_found:
        # We cut at cut_y
        # Crop from top_bound to cut_y
        # But maybe we want to cropping tightly around the logo?
        # Let's crop from 0 to cut_y (or even tighten the top)
        
        # Crop: (left, top, right, bottom)
        # We can also tighten the sides and top while we are at it
        
        # Region of interest is 0 to cut_y
        roi_alpha = alpha[0:cut_y, :]
        roi_rows = np.where(np.any(roi_alpha > 0, axis=1))[0]
        roi_cols = np.where(np.any(roi_alpha > 0, axis=0))[0]
        
        if len(roi_rows) > 0 and len(roi_cols) > 0:
            final_top = roi_rows[0]
            final_bottom = roi_rows[-1] # This should be close to cut_y or above
            final_left = roi_cols[0]
            final_right = roi_cols[-1]
            
            # Add a little padding
            padding = 10
            final_top = max(0, final_top - padding)
            final_bottom = min(cut_y, final_bottom + padding)
            final_left = max(0, final_left - padding)
            final_right = min(img.width, final_right + padding)
            
            cropped = img.crop((final_left, final_top, final_right, final_bottom))
            cropped.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png")
            print("Cropped text successfully")
        else:
            print("ROI empty?")
    else:
        print("No gap found, text might be connected or missing. Saving cropped to content anyway.")
        # If no distinct gap, maybe just crop to content
        cropped = img.crop((0, top_bound, img.width, bottom_bound))
        cropped.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo-trimmed.png")

if __name__ == "__main__":
    crop_text()
