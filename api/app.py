from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost"
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
    "saved_models",
    "1.keras"
)

print("MODEL PATH:", MODEL_PATH)
print("EXISTS:", os.path.exists(MODEL_PATH))


MODEL = tf.keras.models.load_model(MODEL_PATH)

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
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())  # Read the uploaded file (you can process it as needed)
    img_batch = np.expand_dims(image, 0)  # Expand dimensions to match model input shape

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)