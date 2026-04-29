from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.database.database import create_tables
from app.api.routes.auth import router as auth_router
from app.api.routes.bins import router as bins_router
from app.api.routes.trucks import router as trucks_router
from app.api.routes.routes import router as routes_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.shifts import router as shifts_router
from app.api.routes.tenants import router as tenants_router
from app.api.routes.company import router as company_router
from app.core.scheduler import start_scheduler, stop_scheduler

create_tables()


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="EcoTrack-IA API",
    description="Sistema Inteligente de Gestao de Residuos Urbanos",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(bins_router)
app.include_router(trucks_router)
app.include_router(routes_router)
app.include_router(analytics_router)
app.include_router(shifts_router)
app.include_router(tenants_router)
app.include_router(company_router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "projeto": "EcoTrack-IA",
        "versao": "1.1.0",
        "scheduler": "ativo",
        "docs": "/docs",
    }
