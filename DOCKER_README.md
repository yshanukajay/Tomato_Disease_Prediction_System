# Tomato Disease Prediction System - Docker Setup

This guide explains how to containerize and run the Tomato Disease Prediction System using Docker.

## Prerequisites

- **Docker**: [Install Docker](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Usually included with Docker Desktop

## Quick Start (Recommended)

### Option 1: Using Docker Compose (Easiest)

1. **Navigate to the project root directory**:
   ```bash
   cd Tomato_Disease_Prediction_System
   ```

2. **Build and run all services**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the API image
   - Build the frontend image
   - Build the mobile app image (Expo server)
   - Start all services
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs
   - **Mobile (Expo)**: http://localhost:19000 (scan QR code with Expo Go app)

3. **Stop the services**:
   ```bash
   docker-compose down
   ```

### Option 2: Building Individual Docker Images

#### Build API Image:
```bash
docker build -f Dockerfile.api -t tomato-disease-api:latest .
```

#### Run API Container:
```bash
docker run -p 8000:8000 -v %cd%\models:/app/models tomato-disease-api:latest
```

#### Build Frontend Image:
```bash
docker build -f Dockerfile.frontend -t tomato-disease-frontend:latest .
```

#### Run Frontend Container:
```bash
docker run -p 3000:3000 tomato-disease-frontend:latest
```

#### Build Mobile (Expo) Image:
```bash
docker build -f Dockerfile.mobile -t tomato-disease-mobile:latest .
```

#### Run Mobile Container:
```bash
docker run -p 19000:19000 -p 19001:19001 -p 8081:8081 tomato-disease-mobile:latest
```

Access at http://localhost:19000 and scan the QR code with Expo Go app.

## Accessing the Application

After running `docker-compose up`:

- **Frontend (Web)**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Backend**: http://localhost:8000
- **Mobile App (Expo)**: 
  - Open http://localhost:19000 in your browser to see the Expo QR code
  - Scan with **Expo Go** app on your phone (iOS/Android)
  - Or download from: [Expo Go App](https://expo.dev/client)

## File Structure

```
Dockerfile.api          - Docker image for the FastAPI backend
Dockerfile.frontend     - Docker image for the React frontend
Dockerfile.mobile       - Docker image for the Expo mobile app
docker-compose.yml      - Orchestrates all services
.dockerignore          - Files excluded from Docker build context
```

## Environment Variables

The Docker Compose setup automatically configures:
- `REACT_APP_API_URL=http://api:8000` for frontend and mobile to communicate with the backend
- `EXPO_USE_HTTPS=false` for mobile development mode

## Volumes

- **API Models**: The `models/` directory is mounted as a volume, allowing model updates without rebuilding

## Using the Mobile App

### Prerequisites
1. Download **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Steps
1. Run `docker-compose up`
2. Look for the Expo QR code in the terminal output
3. Open **Expo Go** on your phone
4. Tap **Scan QR code** and scan the code from the terminal
5. Wait for the app to load
6. The mobile app will connect to the Docker API automatically

### Troubleshooting Mobile App
- If the mobile app can't reach the API, ensure your PC's IP address is accessible from your phone (same WiFi network)
- Replace `http://api:8000` with your PC's IP in the mobile environment if needed
- Check container logs: `docker-compose logs mobile`

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use:

**Option A**: Stop the service using the port
```bash
# On Windows PowerShell
Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Option B**: Change ports in `docker-compose.yml`
```yaml
ports:
  - "8001:8000"  # Change external port from 8000 to 8001
```

### Container Fails to Start
Check logs:
```bash
docker-compose logs api
docker-compose logs frontend
```

### Model Not Found
Ensure the `models/best_effnetb0.keras` file exists in the project root.

## Deploying to Another PC

1. **Copy the entire project folder** (or use Git):
   ```bash
   git clone <your-repo-url>
   ```

2. **Install Docker** on the new PC

3. **Run the application**:
   ```bash
   docker-compose up
   ```

That's it! No dependency issues or installation required!

## Production Deployment

For production, you may want to:

1. **Use a production-grade server** (replace `serve` in frontend Dockerfile with Nginx)
2. **Add environment-based configuration**
3. **Use secrets management** for sensitive data
4. **Set resource limits** in docker-compose.yml
5. **Use a container registry** (Docker Hub, AWS ECR, etc.)

## Clean Up

Remove all images and containers:
```bash
docker-compose down -v
docker system prune -a
```
