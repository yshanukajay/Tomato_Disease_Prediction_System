from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Set backend before importing keras
os.environ["KERAS_BACKEND"] = "tensorflow"

import keras
import numpy as np
from io import BytesIO
from PIL import Image, ImageOps
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

app = FastAPI()

# Enhanced CORS for both Local and Network access
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "models",
    "tomato_effnetb0.keras"
)

print("MODEL PATH:", MODEL_PATH)
print("EXISTS:", os.path.exists(MODEL_PATH))

# EfficientNetB0 expects 224x224 RGB with preprocess_input applied
IMAGE_SIZE = 224

# Double-check these match your training labels exactly!
CLASS_NAMES = [ 
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato__Target_Spot',
    'Tomato_healthy' 
]

print(f"Loading model from: {MODEL_PATH}")
try:
    MODEL = keras.models.load_model(MODEL_PATH)
    print(f"Successfully loaded model from: {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

@app.get("/ping")
async def ping():
    return {"status": "Backend is running"}

def read_file_as_image(data) -> np.ndarray:
    img = Image.open(BytesIO(data)).convert("RGB")
    # Using fit to ensure the image is resized to 224x224 without stretching
    img = ImageOps.fit(img, (IMAGE_SIZE, IMAGE_SIZE), method=Image.Resampling.LANCZOS)
    arr = np.asarray(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)
    # EfficientNet preprocessing handles scaling automatically
    arr = preprocess_input(arr)
    return arr

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img_batch = read_file_as_image(await file.read())

        # Inference
        predictions = MODEL.predict(img_batch)
        
        # Get index of highest confidence
        predicted_index = np.argmax(predictions[0])
        confidence = np.max(predictions[0])
        
        # Confidence threshold to detect non-tomato images
        # If confidence is too low, it's likely not a tomato
        CONFIDENCE_THRESHOLD = 0.5
        
        if confidence < CONFIDENCE_THRESHOLD:
            return {
                'class': 'Not a Tomato Leaf',
                'confidence': float(confidence),
                'message': 'The uploaded image does not appear to be a tomato leaf. Please upload a clear image of a tomato plant leaf.'
            }
        
        # Safety check for class name index
        if predicted_index >= len(CLASS_NAMES):
            predicted_class = f"Unknown Disease (Index {predicted_index})"
        else:
            predicted_class = CLASS_NAMES[predicted_index]

        return {
            'class': predicted_class,
            'confidence': float(confidence)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)