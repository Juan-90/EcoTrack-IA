# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — infrastructure/database/database.py
#  SQLite via SQLAlchemy — caminho espelha docker-compose.yml
# ─────────────────────────────────────────────────────────
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:////app_root/app/infrastructure/database/ecotrack.db"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency para injetar sessão do banco nas rotas FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Cria todas as tabelas no banco.
    Chamado no startup da aplicação (main.py).
    """
    from app.domain.entities.user       import User        # noqa: F401
    from app.domain.entities.bin        import Bin         # noqa: F401
    from app.domain.entities.truck      import Truck       # noqa: F401
    from app.domain.entities.route      import Route, RouteStop  # noqa: F401
    from app.domain.entities.collection import Collection, SensorReading  # noqa: F401
    from app.domain.entities.shift      import Shift       # noqa: F401

    Base.metadata.create_all(bind=engine)