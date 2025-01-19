import sys
import json
import cv2 
import pytesseract
import re

# Configure Tesseract executable path for macOS
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

def process_image(image_path):
    """
    Perform OCR on the provided image path and extract information.
    """
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        return {"error": "Failed to load image. Please check the image path."}
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Threshold the image to improve OCR accuracy
    _, thresholded = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    
    # Perform OCR
    text = pytesseract.image_to_string(thresholded)

    # Extract store name (assume it's one of the first lines)
    lines = text.splitlines()
    store_name = None
    for line in lines:
        if len(line.strip()) > 0 and not any(char.isdigit() for char in line):
            store_name = line.strip()
            break

    # Extract grand total using regex
    grand_total = None
    grand_total_matches = re.findall(r'(?:grand\s*total|total\s*amount|total|grand\s*total)\s*[:\-\s]*([\d,\.]+)', text, re.IGNORECASE)
    if grand_total_matches:
        grand_total = grand_total_matches[-1]

    # If no grand total found, try alternative keywords
    if not grand_total:
        total_matches = re.findall(r'(?:Total|AMOUNT|₹|Rs\.?)\s*([\d,\.]+)', text)
        if total_matches:
            grand_total = total_matches[-1]

    # Return extracted data
    return {
        "store_name": store_name if store_name else "Not found",
        "grand_total": grand_total if grand_total else "Not found",
        "raw_text": text  # Include raw OCR text for debugging or future use
    }

def main():
    # Ensure input arguments are passed
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input data provided."}))
        return

    try:
        # Parse input data (should contain `image_path`)
        input_data = json.loads(sys.argv[1])
        image_path = input_data.get("image_path")

        if not image_path:
            print(json.dumps({"error": "Image path is required in the input."}))
            return

        # Process the image and extract data
        result = process_image(image_path)

        # Return the result as JSON
        print(json.dumps(result))

    except Exception as e:
        # Handle unexpected errors
        print(json.dumps({"error": f"An error occurred: {str(e)}"}))

if __name__ == "__main__":
    main()
