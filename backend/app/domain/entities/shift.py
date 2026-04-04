# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — domain/entities/shift.py
#  Turno de coleta configurável pelo admin no painel web
#  Ex: "Manhã" 06:00–13:00, seg-sex
# ─────────────────────────────────────────────────────────
from sqlalchemy import Column, Integer, String, Time, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.infrastructure.database.database import Base


class Shift(Base):
    """
    Turno de coleta definido pelo gestor municipal.
    O scheduler verifica a cada minuto se algum turno
    deve ter suas rotas geradas agora.
    """
    __tablename__ = "shifts"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String, nullable=False)        # ex: "Turno Manhã"
    scheduled_time = Column(Time,   nullable=False)        # ex: 06:00 — hora de geração
    end_time       = Column(Time,   nullable=False)        # ex: 13:00 — hora de término
    active_days    = Column(JSON,   nullable=False)        # [0,1,2,3,4] = seg–sex (0=seg, 6=dom)
    is_active      = Column(Boolean, default=True)         # pode ser desativado pelo admin
    min_fill_level = Column(Integer, default=50)           # só inclui lixeiras acima deste %
    created_at     = Column(DateTime, server_default=func.now())
    updated_at     = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def is_today_active(self, weekday: int) -> bool:
        """weekday: 0=segunda ... 6=domingo"""
        return weekday in (self.active_days or [])
