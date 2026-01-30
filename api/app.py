from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import numpy as np
from io import BytesIO
from PIL import Image, ImageOps
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost",
    "*"  # Allow all origins for mobile app
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

CLASS_NAMES = [ 'Tomato_Bacterial_spot',
                'Tomato_Early_blight',
                'Tomato_Late_blight',
                'Tomato_Leaf_Mold',
                'Tomato__Target_Spot',
                'Tomato_healthy' ]

@app.get("/ping")
async def ping():
    return "Hello, World!"

def read_file_as_image(data) -> np.ndarray:
    # Load, convert to RGB, center-crop/fit, and resize to model's expected size
    img = Image.open(BytesIO(data)).convert("RGB")
    img = ImageOps.fit(img, (IMAGE_SIZE, IMAGE_SIZE), method=Image.LANCZOS)
    arr = np.asarray(img, dtype=np.float32)
    # Add batch dimension and apply EfficientNet preprocessing (scales to float range)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)
    return arr

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    img_batch = read_file_as_image(await file.read())

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)