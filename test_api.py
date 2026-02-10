
import requests
import os

# Create a dummy image if not exists
with open("test.jpg", "wb") as f:
    f.write(os.urandom(1024)) # Garbage data might fail PIL, let's use a real header if needed or just specific bytes. 
    # Actually, the app expects a valid image. 
    # I should assume there is a leaf.jpg in frontend/src based on file list.

url = "http://localhost:8000/predict"
file_path = "frontend/src/leaf.jpg"

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

with open(file_path, "rb") as f:
    files = {"file": f}
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
