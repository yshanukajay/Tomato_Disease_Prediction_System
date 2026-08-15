# =============================================================================
#  Tomato Disease Prediction System -- Makefile
#  Usage: make <target>
#  Run `make help` to see all available commands.
# =============================================================================

# -- Configuration -------------------------------------------------------------
PYTHON        := python
PIP           := pip
VENV_DIR      := venv

API_DIR       := api
FRONTEND_DIR  := frontend
MOBILE_DIR    := mobile

API_URL       := http://localhost:8000
FRONTEND_URL  := http://localhost:3000

DOCKER_COMPOSE        := docker compose
DOCKER_COMPOSE_FILE   := docker-compose.yml
DOCKER_COMPOSE_HUB    := docker-compose.hub.yml

DOCKERHUB_USERNAME    ?= YOUR_DOCKERHUB_USERNAME
IMAGE_TAG             ?= latest

.DEFAULT_GOAL := help
.PHONY: help \
        venv install install-api install-frontend install-mobile \
        dev dev-api dev-frontend dev-mobile \
        build build-frontend \
        docker-build docker-up docker-down docker-restart \
        docker-logs docker-logs-api docker-logs-frontend docker-logs-mobile \
        docker-hub-up docker-hub-down docker-push \
        test test-api check-deps inspect-model \
        lint format \
        ci ci-api ci-frontend ci-mobile ci-docker \
        clean clean-venv clean-docker clean-build clean-cache


# =============================================================================
#  HELP
# =============================================================================
help:
	@echo ""
	@echo " =================================================================="
	@echo "     Tomato Disease Prediction System -- Makefile"
	@echo " =================================================================="
	@echo ""
	@echo " -- Setup ----------------------------------------------------------"
	@echo "   make venv              Create Python virtual environment"
	@echo "   make install           Install all Python + Node dependencies"
	@echo "   make install-api       Install API Python dependencies only"
	@echo "   make install-frontend  Install frontend (React) dependencies"
	@echo "   make install-mobile    Install mobile (Expo) dependencies"
	@echo ""
	@echo " -- Development -----------------------------------------------------"
	@echo "   make dev               Launch API + Frontend dev servers"
	@echo "   make dev-api           Run FastAPI dev server  (port 8000)"
	@echo "   make dev-frontend      Run React dev server    (port 3000)"
	@echo "   make dev-mobile        Start Expo mobile dev server"
	@echo ""
	@echo " -- Build -----------------------------------------------------------"
	@echo "   make build             Build all Docker images (local)"
	@echo "   make build-frontend    Production build of the React app"
	@echo ""
	@echo " -- Docker ----------------------------------------------------------"
	@echo "   make docker-build         Build all Docker images"
	@echo "   make docker-up            Start all services (detached)"
	@echo "   make docker-down          Stop and remove all containers"
	@echo "   make docker-restart       Restart all services"
	@echo "   make docker-logs          Tail logs for all containers"
	@echo "   make docker-logs-api      Tail API container logs"
	@echo "   make docker-logs-frontend Tail Frontend container logs"
	@echo "   make docker-logs-mobile   Tail Mobile container logs"
	@echo ""
	@echo " -- Docker Hub ------------------------------------------------------"
	@echo "   make docker-hub-up     Pull & start images from Docker Hub"
	@echo "   make docker-hub-down   Stop Docker Hub stack"
	@echo "   make docker-push       Tag & push images to Docker Hub"
	@echo "                          (set DOCKERHUB_USERNAME=<u> IMAGE_TAG=<t>)"
	@echo ""
	@echo " -- Testing ---------------------------------------------------------"
	@echo "   make test              Run all tests"
	@echo "   make test-api          API smoke test  (API must be running)"
	@echo "   make check-deps        Check Python dependency compatibility"
	@echo "   make inspect-model     Inspect the saved ML model"
	@echo ""
	@echo " -- Lint & Format ---------------------------------------------------"
	@echo "   make lint              Lint Python source files with flake8"
	@echo "   make format            Auto-format Python sources with black"
	@echo ""
	@echo " -- CI (GitHub Actions) -------------------------------------------"
	@echo "   make ci              Show CI workflow status (requires gh CLI)"
	@echo "   make ci-api          Open ci-api.yml in editor"
	@echo "   make ci-frontend     Open ci-frontend.yml in editor"
	@echo "   make ci-mobile       Open ci-mobile.yml in editor"
	@echo "   make ci-docker       Open ci-docker.yml in editor"
	@echo ""
	@echo " -- Clean -----------------------------------------------------------"
	@echo "   make clean             Remove build artefacts and caches"
	@echo "   make clean-venv        Remove the Python virtual environment"
	@echo "   make clean-docker      Remove project Docker images"
	@echo "   make clean-build       Remove the React production build"
	@echo "   make clean-cache       Remove Python __pycache__ directories"
	@echo ""


# =============================================================================
#  SETUP
# =============================================================================

## Create Python virtual environment
venv:
	@echo "[setup] Creating Python virtual environment in '$(VENV_DIR)/'..."
	$(PYTHON) -m venv $(VENV_DIR)
	@echo "[setup] Done. Activate with:"
	@echo "        Windows  : $(VENV_DIR)\Scripts\activate"
	@echo "        Unix/macOS: source $(VENV_DIR)/bin/activate"

## Install all dependencies (Python + Node)
install: install-api install-frontend install-mobile
	@echo "[setup] All dependencies installed."

## Install Python (API) dependencies
install-api: venv
	@echo "[setup] Installing API Python dependencies..."
	$(VENV_DIR)/Scripts/pip install --upgrade pip
	$(VENV_DIR)/Scripts/pip install -r requirements.txt
	$(VENV_DIR)/Scripts/pip install -r $(API_DIR)/requirements.txt

## Install React (frontend) Node dependencies
install-frontend:
	@echo "[setup] Installing frontend Node dependencies..."
	cd $(FRONTEND_DIR) && npm install

## Install Expo (mobile) Node dependencies
install-mobile:
	@echo "[setup] Installing mobile Node dependencies..."
	cd $(MOBILE_DIR) && npm install


# =============================================================================
#  DEVELOPMENT
# =============================================================================

## Launch API and Frontend dev servers (Windows  opens two cmd windows)
dev:
	@echo "[dev] Starting API and Frontend dev servers..."
	start cmd /k "cd $(API_DIR) && ..\$(VENV_DIR)\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000"
	start cmd /k "cd $(FRONTEND_DIR) && npm start"

## Run FastAPI development server on port 8000
dev-api:
	@echo "[dev] Starting FastAPI at $(API_URL) ..."
	cd $(API_DIR) && ..\$(VENV_DIR)/Scripts/uvicorn main:app --reload --host 0.0.0.0 --port 8000

## Run React development server on port 3000
dev-frontend:
	@echo "[dev] Starting React dev server at $(FRONTEND_URL) ..."
	cd $(FRONTEND_DIR) && npm start

## Start Expo mobile development server
dev-mobile:
	@echo "[dev] Starting Expo dev server..."
	cd $(MOBILE_DIR) && npm start


# =============================================================================
#  BUILD
# =============================================================================

## Build all Docker images locally (alias for docker-build)
build: docker-build

## Create a production build of the React frontend
build-frontend:
	@echo "[build] Building React production bundle..."
	cd $(FRONTEND_DIR) && npm run build
	@echo "[build] Output: $(FRONTEND_DIR)/build/"


# =============================================================================
#  DOCKER
# =============================================================================

## Build all Docker images defined in docker-compose.yml
docker-build:
	@echo "[docker] Building all images..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

## Start all services (detached) via Docker Compose
docker-up:
	@echo "[docker] Starting all services..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "[docker] Running at:"
	@echo "         API      -> $(API_URL)"
	@echo "         Frontend -> $(FRONTEND_URL)"
	@echo "         Mobile   -> http://localhost:19000"

## Stop and remove all containers and networks
docker-down:
	@echo "[docker] Stopping all services..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

## Restart all Docker services
docker-restart: docker-down docker-up

## Tail logs for all containers
docker-logs:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f

## Tail logs for the API container only
docker-logs-api:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f api

## Tail logs for the Frontend container only
docker-logs-frontend:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f frontend

## Tail logs for the Mobile container only
docker-logs-mobile:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f mobile


# =============================================================================
#  DOCKER HUB
# =============================================================================

## Pull and start pre-built images from Docker Hub
docker-hub-up:
	@echo "[docker-hub] Pulling images for '$(DOCKERHUB_USERNAME)' ..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_HUB) pull
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_HUB) up -d

## Stop the Docker Hub stack
docker-hub-down:
	@echo "[docker-hub] Stopping Docker Hub services..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_HUB) down

## Tag and push all images to Docker Hub
docker-push: docker-build
	@echo "[docker-hub] Pushing images as '$(DOCKERHUB_USERNAME)' (tag: $(IMAGE_TAG)) ..."
	docker tag tomato-disease-api:latest      $(DOCKERHUB_USERNAME)/tomato-disease-api:$(IMAGE_TAG)
	docker tag tomato-disease-frontend:latest $(DOCKERHUB_USERNAME)/tomato-disease-frontend:$(IMAGE_TAG)
	docker tag tomato-disease-mobile:latest   $(DOCKERHUB_USERNAME)/tomato-disease-mobile:$(IMAGE_TAG)
	docker push $(DOCKERHUB_USERNAME)/tomato-disease-api:$(IMAGE_TAG)
	docker push $(DOCKERHUB_USERNAME)/tomato-disease-frontend:$(IMAGE_TAG)
	docker push $(DOCKERHUB_USERNAME)/tomato-disease-mobile:$(IMAGE_TAG)
	@echo "[docker-hub] Push complete."


# =============================================================================
#  TESTING
# =============================================================================

## Run all tests
test: test-api

## Run API smoke test (API must be running at $(API_URL))
test-api:
	@echo "[test] Running API smoke test against $(API_URL) ..."
	$(VENV_DIR)/Scripts/python test_api.py

## Check Python dependency compatibility
check-deps:
	@echo "[test] Checking Python dependencies..."
	$(VENV_DIR)/Scripts/python check_deps.py

## Inspect the saved ML model
inspect-model:
	@echo "[test] Inspecting ML model..."
	$(VENV_DIR)/Scripts/python inspect_model.py


# =============================================================================
#  LINT & FORMAT
# =============================================================================

## Lint Python source files with flake8
lint:
	@echo "[lint] Running flake8..."
	$(VENV_DIR)/Scripts/flake8 $(API_DIR)/ --max-line-length=120 --exclude=__pycache__

## Auto-format Python source files with black
format:
	@echo "[format] Running black..."
	$(VENV_DIR)/Scripts/black $(API_DIR)/ --line-length=120


# =============================================================================
#  CI (GitHub Actions)
#  Workflows live in .github/workflows/ and run automatically on GitHub.
#  These targets are local helpers to view or validate them.
# =============================================================================

## Show recent CI run status via GitHub CLI (gh must be installed & authed)
ci:
	@echo "[ci] Fetching CI status from GitHub..."
	gh run list --limit 10

## Open the API CI workflow file
ci-api:
	start .github\workflows\ci-api.yml

## Open the Frontend CI workflow file
ci-frontend:
	start .github\workflows\ci-frontend.yml

## Open the Mobile CI workflow file
ci-mobile:
	start .github\workflows\ci-mobile.yml

## Open the Docker CI workflow file
ci-docker:
	start .github\workflows\ci-docker.yml


# =============================================================================
#  CLEAN
# =============================================================================

## Remove build artefacts and Python caches (safe default)
clean: clean-build clean-cache
	@echo "[clean] Done."

## Remove the Python virtual environment
clean-venv:
	@echo "[clean] Removing virtual environment..."
	if exist $(VENV_DIR) rmdir /s /q $(VENV_DIR)

## Remove all project Docker images and volumes
clean-docker: docker-down
	@echo "[clean] Removing Docker images..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

## Remove the React production build output
clean-build:
	@echo "[clean] Removing frontend build directory..."
	if exist $(FRONTEND_DIR)/build rmdir /s /q $(FRONTEND_DIR)/build

## Remove Python __pycache__ directories and .pyc files
clean-cache:
	@echo "[clean] Removing Python cache files..."
	for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
	del /s /q *.pyc 2>nul & exit 0
