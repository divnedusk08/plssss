#!/usr/bin/env python3
import os
import subprocess
import sys

def save_image():
    try:
        # Try to get image from clipboard (if available)
        result = subprocess.run(['osascript', '-e', '''
        set the clipboard to (read (choose file with prompt "Select the Log Hours Interface image:") as «class PNGf»)
        '''], capture_output=True, text=True)
        
        if result.returncode == 0:
            # Save clipboard to file
            subprocess.run(['osascript', '-e', '''
            set png_data to the clipboard as «class PNGf»
            set file_path to "/Users/dhriti/HourTrackrr/src/assets/LogHoursInterface.png"
            set file_ref to open for access file file_path with write permission
            write png_data to file_ref
            close access file_ref
            '''])
            print("Image saved successfully!")
            return True
    except Exception as e:
        print(f"Error: {e}")
        
    print("Please manually save the image as LogHoursInterface.png in src/assets/")
    return False

if __name__ == "__main__":
    save_image() 