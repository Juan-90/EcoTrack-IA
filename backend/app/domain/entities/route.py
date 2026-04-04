# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — domain/entities/route.py  (VERSÃO ATUALIZADA)
#  Adiciona: shift_id, scheduled_start/end, locked, snapshot
#
#  SUBSTITUIR o route.py anterior por este arquivo.
# ─────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, Float, DateTime, Time, ForeignKey, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.infrastructure.database.database import Base


class RouteStatusEnum(str, enum.Enum):
    planejada = "planejada"
    ativa     = "ativa"
    concluida = "concluida"


class Route(Base):
    __tablename__ = "routes"

    id                 = Column(Integer, primary_key=True, index=True)
    truck_id           = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    shift_id           = Column(Integer, ForeignKey("shifts.id"), nullable=True)   # turno que gerou esta rota
    status             = Column(Enum(RouteStatusEnum), default=RouteStatusEnum.planejada)

    # Horários planejados (definidos pelo turno)
    scheduled_start    = Column(Time,     nullable=True)   # ex: 06:00
    scheduled_end      = Column(Time,     nullable=True)   # ex: 13:00

    # Horários reais de execução
    start_time         = Column(DateTime, nullable=True)
    end_time           = Column(DateTime, nullable=True)

    total_distance_km  = Column(Float,   nullable=True)
    created_at         = Column(DateTime, server_default=func.now())

    # ── Campos críticos para a decisão da equipe ──────────
    locked             = Column(Boolean, default=False)
    """
    True = rota TRAVADA.
    Uma vez que o caminhão saiu, nenhuma atualização de sensor
    pode modificar esta rota. O percurso é fixo até a conclusão.
    """

    bins_snapshot      = Column(JSON, nullable=True)
    """
    Foto dos níveis das lixeiras NO MOMENTO em que a rota foi gerada.
    Formato: [{"bin_id": 1, "level": 92, "priority": "alta"}, ...]
    Garante rastreabilidade: sabemos o estado real quando a rota foi criada.
    """

    stops = relationship("RouteStop", back_populates="route", order_by="RouteStop.order")


class RouteStop(Base):
    __tablename__ = "route_stops"

    id           = Column(Integer, primary_key=True, index=True)
    route_id     = Column(Integer, ForeignKey("routes.id"), nullable=False)
    bin_id       = Column(Integer, ForeignKey("bins.id"),   nullable=False)
    order        = Column(Integer, nullable=False)
    collected_at = Column(DateTime, nullable=True)

    route = relationship("Route", back_populates="stops")
