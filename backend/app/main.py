from fastapi import FastAPI
from app.api.routes import bins
from app.api import auth
from app.infrastructure.database.database import engine, Base
from app.domain.entities import user
from app.api.routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoTrack-IA API")

app.include_router(bins.router)
app.include_router(auth.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "EcoTrack-IA Backend Running 🚀"}