from fastapi import FastAPI
from app.api.routes import bins

app = FastAPI(title="EcoTrack-IA API")

app.include_router(bins.router)

@app.get("/")
def root():
    return {"message": "EcoTrack-IA Backend Running 🚀"}