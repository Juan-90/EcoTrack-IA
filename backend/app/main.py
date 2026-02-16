from fastapi import FastAPI
from app.api.routes import bins
from app.api import auth

app = FastAPI(title="EcoTrack-IA API")

app.include_router(bins.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "EcoTrack-IA Backend Running 🚀"}