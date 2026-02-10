
import os
os.environ["KERAS_BACKEND"] = "tensorflow"
import keras
import numpy as np

MODEL_PATH = "models/1.keras"

try:
    model = keras.models.load_model(MODEL_PATH)
    model.summary()
    
    # Try to predict with dummy data to see where it fails exactly if summary doesn't help
    dummy_input = np.zeros((1, 256, 256, 3)) # Try 256 just in case
    # model.predict(dummy_input)
except Exception as e:
    print(f"Error: {e}")
