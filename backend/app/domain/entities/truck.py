# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — domain/entities/truck.py
# ─────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
import enum

from app.infrastructure.database.database import Base


class TruckStatusEnum(str, enum.Enum):
    em_rota    = "em_rota"
    retornando = "retornando"
    aguardando = "aguardando"
    manutencao = "manutencao"


class Truck(Base):
    __tablename__ = "trucks"

    id               = Column(Integer, primary_key=True, index=True)
    plate            = Column(String, unique=True, nullable=False)   # placa
    driver           = Column(String, nullable=False)                # motorista
    capacity_kg      = Column(Float, default=8000.0)
    current_load_kg  = Column(Float, default=0.0)
    current_route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    status           = Column(Enum(TruckStatusEnum), default=TruckStatusEnum.aguardando)
    latitude         = Column(Float, nullable=True)                  # GPS atual
    longitude        = Column(Float, nullable=True)
