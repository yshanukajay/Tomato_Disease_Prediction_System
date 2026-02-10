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
    "best_effnetb0.keras"
)

print("MODEL PATH:", MODEL_PATH)
print("EXISTS:", os.path.exists(MODEL_PATH))


MODEL = tf.keras.models.load_model(MODEL_PATH)

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

# Using the filename seen in your successful load logs
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "tomato_effnetb0.keras")

print(f"Loading model from: {MODEL_PATH}")
try:
    # We use safe_mode=False if you have custom layers/Lambda layers
    MODEL = keras.models.load_model(MODEL_PATH)
    print("--- Model Summary ---")
    MODEL.summary() 
    print(f"Successfully loaded model from: {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback to 1.keras if the first one fails
    MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "1.keras")
    MODEL = keras.models.load_model(MODEL_PATH)

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
        
        # Safety check for class name index
        if predicted_index >= len(CLASS_NAMES):
            predicted_class = f"Unknown Disease (Index {predicted_index})"
        else:
            predicted_class = CLASS_NAMES[predicted_index]
            
        confidence = np.max(predictions[0])

        return {
            'class': predicted_class,
            'confidence': float(confidence)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)