
try:
    import fastapi
    print("fastapi: OK")
except ImportError:
    print("fastapi: MISSING")

try:
    import uvicorn
    print("uvicorn: OK")
except ImportError:
    print("uvicorn: MISSING")

try:
    import tensorflow
    print("tensorflow: OK")
except ImportError:
    print("tensorflow: MISSING")

try:
    import PIL
    print("PIL: OK")
except ImportError:
    print("PIL: MISSING")
