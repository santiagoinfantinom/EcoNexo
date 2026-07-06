import os
import shutil
import glob

# Source directory (current dir where artifacts are saved usually, or search recursively)
# In this environment, generate_image saves to artifacts. The user wants them in public/projects/
# The agent will have to copy it manually after generation because I don't know the exact path of the artifact from here without the tool output.
# Actually, the agent tool `generate_image` saves it as an artifact. I need to copy it from the artifact path to public/projects.

# This script assumes the agent will call it with arguments or I'll just hardcode the move if I know the filename.
# Since I don't know the absolute path of the generated artifact yet, I will write this script to accept source and destination.

import sys

if len(sys.argv) < 3:
    print("Usage: python move_image.py <source_path> <dest_path>")
    sys.exit(1)

source = sys.argv[1]
dest = sys.argv[2]

try:
    shutil.copy(source, dest)
    print(f"Moved {source} to {dest}")
except Exception as e:
    print(f"Error moving file: {e}")
