from PIL import Image

def rotate_images():
    img_path = "/Users/santiago/Documents/Projects/EcoNexo/public/logo_recolored_clean.png"
    img = Image.open(img_path)

    # Rotate 45 degrees Counter-Clockwise (Standard rotation direction)
    # expand=True ensures the image isn't cropped
    rot_ccw = img.rotate(45, expand=True)
    rot_ccw.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_rot_ccw.png")
    
    # Rotate 45 degrees Clockwise (-45)
    rot_cw = img.rotate(-45, expand=True)
    rot_cw.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_rot_cw.png")
    
    # Rotate 90 degrees (CCW)
    rot_90 = img.rotate(90, expand=True)
    rot_90.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_rot_90.png")

    # Rotate -90 degrees (CW) - Requested by User
    rot_neg_90 = img.rotate(-90, expand=True)
    rot_neg_90.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_rot_m90.png")

    # Flip horizontally (Rotate over Y axis) - Requested by User
    # We apply this to the -90 rotated version as that was the context
    img_m90 = Image.open("/Users/santiago/Documents/Projects/EcoNexo/public/logo_rot_m90.png")
    flip_y = img_m90.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    flip_y.save("/Users/santiago/Documents/Projects/EcoNexo/public/logo_final_flipped.png")

    print("Rotated and flipped images saved.")

if __name__ == "__main__":
    rotate_images()
