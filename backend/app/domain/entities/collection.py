# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — domain/entities/collection.py
#  Registro histórico de cada coleta realizada
#  Também recebe leituras do sensor ESP32
# ─────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.infrastructure.database.database import Base


class Collection(Base):
    __tablename__ = "collections"

    id                   = Column(Integer, primary_key=True, index=True)
    bin_id               = Column(Integer, ForeignKey("bins.id"),   nullable=False)
    truck_id             = Column(Integer, ForeignKey("trucks.id"), nullable=True)  # null = leitura IoT sem coleta
    timestamp            = Column(DateTime, server_default=func.now())
    level_at_collection  = Column(Float, nullable=False)   # nível no momento da coleta/leitura


class SensorReading(Base):
    """
    Leituras brutas do ESP32 (sensor ultrassônico).
    Recebidas via POST /iot/reading — processadas e salvas aqui.
    """
    __tablename__ = "sensor_readings"

    id         = Column(Integer, primary_key=True, index=True)
    bin_id     = Column(Integer, ForeignKey("bins.id"), nullable=False)
    raw_cm     = Column(Float, nullable=False)    # distância em cm lida pelo sensor
    level_pct  = Column(Float, nullable=False)    # percentual calculado pelo backend
    timestamp  = Column(DateTime, server_default=func.now())
