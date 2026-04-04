# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — domain/entities/bin.py
#  Representa uma lixeira monitorada por sensor IoT (ESP32)
#  Prioridade calculada automaticamente pelo backend
# ─────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.infrastructure.database.database import Base


class PriorityEnum(str, enum.Enum):
    """
    Classificação espelhada no README e no mobile:
    🔴 Alta  → level > 80%
    🟡 Média → level 50–79%
    🟢 Baixa → level < 50%
    """
    alta  = "alta"
    media = "media"
    baixa = "baixa"


class BinStatusEnum(str, enum.Enum):
    ativa      = "ativa"
    cheia      = "cheia"
    manutencao = "manutencao"
    offline    = "offline"


class Bin(Base):
    __tablename__ = "bins"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String, nullable=False)          # ex: "Hospital"
    location       = Column(String, nullable=True)           # endereço / descrição
    zone           = Column(String, nullable=True)           # bairro / zona
    latitude       = Column(Float, nullable=False)
    longitude      = Column(Float, nullable=False)
    level          = Column(Float, default=0.0)              # 0–100 (% de ocupação)
    priority       = Column(Enum(PriorityEnum), default=PriorityEnum.baixa)
    status         = Column(Enum(BinStatusEnum), default=BinStatusEnum.ativa)
    last_collected = Column(DateTime, nullable=True)
    created_at     = Column(DateTime, server_default=func.now())
    updated_at     = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def calculate_priority(self) -> PriorityEnum:
        """
        Lógica de classificação automática.
        Chamada sempre que o sensor envia novo dado.
        """
        if self.level > 80:
            return PriorityEnum.alta
        elif self.level >= 50:
            return PriorityEnum.media
        else:
            return PriorityEnum.baixa
