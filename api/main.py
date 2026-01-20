from fastapi import FastAPI, File, UploadFile
import uvicorn

app = FastAPI()

@app.get("/hello")
async def read_root():
    return {"message": "Hello, World!"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
    ):
    
    bytes_data = await file.read()
    # Here you would add your prediction logic using the bytes_data
    

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)