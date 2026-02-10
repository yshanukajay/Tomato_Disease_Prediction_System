# Docker Hub Deployment Guide

## Prerequisites

1. **Docker Hub Account**: [Sign up here](https://hub.docker.com/signup) if you don't have one
2. **Built Docker Images**: Run `docker-compose build` first

## Quick Deployment

### Option 1: Using PowerShell Script (Recommended)

```powershell
.\deploy-to-dockerhub.ps1
```

The script will:
1. Prompt for your Docker Hub username
2. Login to Docker Hub
3. Tag all 3 images
4. Push them to Docker Hub

### Option 2: Manual Steps

1. **Login to Docker Hub**:
   ```powershell
   docker login
   ```

2. **Tag your images** (replace `YOUR_USERNAME` with your Docker Hub username):
   ```powershell
   docker tag tomato_disease_prediction_system-api:latest YOUR_USERNAME/tomato-disease-api:latest
   docker tag tomato_disease_prediction_system-frontend:latest YOUR_USERNAME/tomato-disease-frontend:latest
   docker tag tomato_disease_prediction_system-mobile:latest YOUR_USERNAME/tomato-disease-mobile:latest
   ```

3. **Push to Docker Hub**:
   ```powershell
   docker push YOUR_USERNAME/tomato-disease-api:latest
   docker push YOUR_USERNAME/tomato-disease-frontend:latest
   docker push YOUR_USERNAME/tomato-disease-mobile:latest
   ```

## Using Images from Docker Hub

### On Another PC:

1. **Pull the images**:
   ```powershell
   docker pull YOUR_USERNAME/tomato-disease-api:latest
   docker pull YOUR_USERNAME/tomato-disease-frontend:latest
   docker pull YOUR_USERNAME/tomato-disease-mobile:latest
   ```

2. **Update docker-compose.hub.yml**:
   - Replace `YOUR_DOCKERHUB_USERNAME` with your actual username

3. **Run with docker-compose**:
   ```powershell
   # Copy the models folder to the new PC
   # Then run:
   docker-compose -f docker-compose.hub.yml up
   ```

## Image Sizes (Approximate)

- **API**: ~2.5 GB (includes TensorFlow)
- **Frontend**: ~150 MB
- **Mobile**: ~500 MB

## Push Times (Approximate)

- On 10 Mbps upload: ~30-45 minutes
- On 50 Mbps upload: ~10-15 minutes
- On 100 Mbps upload: ~5-8 minutes

## Viewing Your Images

After deployment, visit:
- https://hub.docker.com/r/YOUR_USERNAME/tomato-disease-api
- https://hub.docker.com/r/YOUR_USERNAME/tomato-disease-frontend
- https://hub.docker.com/r/YOUR_USERNAME/tomato-disease-mobile

## Making Images Public

By default, images are public. To make them private:
1. Go to Docker Hub
2. Click on the repository
3. Settings → Make Private

## Updating Images

When you make changes:

```powershell
# Rebuild
docker-compose build

# Re-run deployment script
.\deploy-to-dockerhub.ps1
```

## Troubleshooting

### "unauthorized: authentication required"
- Run `docker login` again

### "denied: requested access to the resource is denied"
- Check your Docker Hub username spelling
- Ensure you have permissions to push

### Push is very slow
- This is normal for large images like TensorFlow
- Consider upgrading your internet connection
- Use WiFi instead of mobile data

## Security Notes

⚠️ **Important**:
- Never commit Docker Hub credentials to Git
- Use Docker Hub access tokens instead of passwords
- Keep sensitive data out of Docker images
- Use `.dockerignore` to exclude secrets
