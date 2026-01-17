#!/bin/bash

# Script to copy all images from old conversation to public/projects

OLD_DIR="/Users/santiago/.gemini/antigravity/brain/56f12204-effa-4fa1-a2d9-6c7a5aa6edf4"
PUBLIC_DIR="/Users/santiago/Documents/Projects/EcoNexo/public/projects"

echo "Copying images from old conversation to public/projects..."

# Check if old directory exists
if [ ! -d "$OLD_DIR" ]; then
    echo "Error: Old directory not found: $OLD_DIR"
    exit 1
fi

# Create public/projects if it doesn't exist
mkdir -p "$PUBLIC_DIR"

# Copy all PNG files
cp "$OLD_DIR"/*.png "$PUBLIC_DIR/" 2>/dev/null

# Count copied files
COUNT=$(ls -1 "$PUBLIC_DIR"/*.png 2>/dev/null | wc -l)
echo "Copied $COUNT image files to $PUBLIC_DIR"

echo "Done!"
