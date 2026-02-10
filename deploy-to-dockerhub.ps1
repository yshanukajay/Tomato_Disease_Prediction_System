# Docker Hub Deployment Script for Tomato Disease Prediction System
# Run this script after building your Docker images

Write-Host "=== Docker Hub Deployment Script ===" -ForegroundColor Cyan

# Step 1: Get Docker Hub username
$DOCKERHUB_USERNAME = Read-Host "Enter your Docker Hub username"

if ([string]::IsNullOrWhiteSpace($DOCKERHUB_USERNAME)) {
    Write-Host "Error: Docker Hub username is required!" -ForegroundColor Red
    exit 1
}

# Step 2: Login to Docker Hub
Write-Host "`nStep 1: Logging into Docker Hub..." -ForegroundColor Yellow
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker login failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Login successful." -ForegroundColor Green

# Step 3: Tag the images
Write-Host "`nStep 2: Tagging images..." -ForegroundColor Yellow

$images = @(
    @{ LocalName = "tomato_disease_prediction_system-api"; RemoteName = "$DOCKERHUB_USERNAME/tomato-disease-api" },
    @{ LocalName = "tomato_disease_prediction_system-frontend"; RemoteName = "$DOCKERHUB_USERNAME/tomato-disease-frontend" },
    @{ LocalName = "tomato_disease_prediction_system-mobile"; RemoteName = "$DOCKERHUB_USERNAME/tomato-disease-mobile" }
)

foreach ($image in $images) {
    Write-Host "  Tagging $($image.LocalName)..." -ForegroundColor Cyan
    docker tag "$($image.LocalName):latest" "$($image.RemoteName):latest"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to tag $($image.LocalName)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "All images tagged." -ForegroundColor Green

# Step 4: Push images to Docker Hub
Write-Host "`nStep 3: Pushing images to Docker Hub..." -ForegroundColor Yellow
Write-Host "(This may take several minutes...)" -ForegroundColor Gray

foreach ($image in $images) {
    Write-Host "`n  Pushing $($image.RemoteName)..." -ForegroundColor Cyan
    docker push "$($image.RemoteName):latest"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to push $($image.RemoteName)" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Pushed $($image.RemoteName)" -ForegroundColor Green
}

# Step 5: Summary
Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "`nYour images are now available on Docker Hub:" -ForegroundColor Cyan
Write-Host "  - https://hub.docker.com/r/$DOCKERHUB_USERNAME/tomato-disease-api" -ForegroundColor White
Write-Host "  - https://hub.docker.com/r/$DOCKERHUB_USERNAME/tomato-disease-frontend" -ForegroundColor White
Write-Host "  - https://hub.docker.com/r/$DOCKERHUB_USERNAME/tomato-disease-mobile" -ForegroundColor White

Write-Host "`nTo pull and run on another machine:" -ForegroundColor Cyan
Write-Host "  docker pull $DOCKERHUB_USERNAME/tomato-disease-api:latest" -ForegroundColor Gray
Write-Host "  docker pull $DOCKERHUB_USERNAME/tomato-disease-frontend:latest" -ForegroundColor Gray
Write-Host "  docker pull $DOCKERHUB_USERNAME/tomato-disease-mobile:latest" -ForegroundColor Gray
