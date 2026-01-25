# Tomo Vision

A machine learning application that predicts tomato plant diseases from leaf images using deep learning. 

## About

This project uses a CNN model built with TensorFlow to classify tomato leaf images into 6 categories:
- Tomato Bacterial Spot
- Tomato Early Blight
- Tomato Late Blight
- Tomato Leaf Mold
- Tomato Target Spot
- Healthy Tomato

## Project Structure

```
├── api/                    # FastAPI backend
├── frontend/               # React frontend
├── notebooks/              # Model training notebooks
├── saved_models/           # Trained model files
└── requirements            # Python dependencies
```

## Requirements

- Python 3.8+
- Node.js 14+
- TensorFlow 2.10.1
- FastAPI
- React 17

## Installation

### Backend

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

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open on `http://localhost:3000`

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Upload a tomato leaf image
4. View the disease prediction and confidence score

## API Endpoints

- `GET /ping` - Health check
- `POST /predict` - Upload image for disease prediction

## Technologies Used

**Backend:**
- FastAPI
- TensorFlow
- NumPy
- Pillow

**Frontend:**
- React
- Material-UI
- Axios

## License

MIT License

## Author

Yohan Shanuka Jayakody ([@yshanukajay](https://github.com/yshanukajay))
