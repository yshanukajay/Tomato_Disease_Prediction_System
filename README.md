# Tomo Vision

A machine learning application that predicts tomato plant diseases from leaf images using deep learning.

## About

This project uses EfficientNetB0 model to classify tomato leaf images into 6 categories:
- Tomato Bacterial Spot
- Tomato Early Blight
- Tomato Late Blight
- Tomato Leaf Mold
- Tomato Target Spot
- Healthy Tomato

## Project Structure

```
├── api/                    # FastAPI backend
├── frontend/               # React web application
├── mobile/                 # React Native mobile app
├── models/                 # Trained model files
├── notebooks/              # Model training notebooks
├── saved_models/           # Model checkpoints
└── requirements            # Python dependencies
```

## Requirements

- Python 3.8+
- Node.js 14+
- TensorFlow 2.10.1
- FastAPI 0.103.2
- React 17

## Installation

### Backend (FastAPI)

1. Clone the repository:
```bash
git clone https://github.com/yshanukajay/Tomato_Disease_Prediction_System.git
cd Tomato_Disease_Prediction_System
```

2. Install Python dependencies:
```bash
pip install -r requirements
```

3. Run the API server:
```bash
cd api
python app.py
```

The API will run on `http://localhost:8000`

### Frontend (React Web App)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```
Edit `.env` and set `REACT_APP_API_URL=http://localhost:8000/predict`

4. Start the development server:
```bash
npm start
```

The app will open on `http://localhost:3000`

### Mobile (React Native/Expo)

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in `app.json`:
```json
"extra": {
  "apiUrl": "http://10.0.2.2:8000/predict"
}
```

4. Start Expo:
```bash
npm start
```

## Usage

### Web Application
1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Upload a tomato leaf image
4. View the disease prediction and confidence score

### Mobile Application
1. Launch the app on your device
2. Choose "Take Photo" or "Choose from Gallery"
3. View the prediction results with disease information

## API Endpoints

- `GET /ping` - Health check
- `POST /predict` - Upload image for disease prediction

## Technologies Used

**Backend:**
- FastAPI
- TensorFlow
- EfficientNetB0
- NumPy
- Pillow

**Frontend:**
- React
- Material-UI
- Axios

**Mobile:**
- React Native
- Expo
- Expo Image Picker

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Yohan Shanuka Jayakody ([@yshanukajay](https://github.com/yshanukajay))
