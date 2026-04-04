# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/bins.py  (trecho atualizado)
#
#  ALTERAÇÃO CRÍTICA no endpoint POST /bins/{id}/sensor:
#  Quando uma rota está TRAVADA (locked=True), a atualização
#  do sensor NÃO modifica as rotas em andamento.
#  O nível é atualizado no banco para histórico/analytics,
#  mas o percurso do caminhão permanece inalterado.
# ─────────────────────────────────────────────────────────

# Adicionar este import no bins.py existente:
# from app.domain.entities.route import Route, RouteStop, RouteStatusEnum

# Substituir o endpoint /sensor por esta versão:

"""
@router.post("/{bin_id}/sensor")
def receive_sensor_data(
    bin_id: int,
    data: SensorUpdateSchema,
    db: Session = Depends(get_db),
):
    bin_ = db.query(Bin).filter(Bin.id == bin_id).first()
    if not bin_:
        raise HTTPException(status_code=404, detail="Lixeira não encontrada")

    level = max(0.0, min(100.0, (1 - data.raw_cm / data.bin_height_cm) * 100))

    bin_.level    = round(level, 1)
    bin_.priority = bin_.calculate_priority()

    if level > 95:
        bin_.status = BinStatusEnum.cheia

    db.commit()

    # ── Verifica se esta lixeira está em rota TRAVADA ─────
    active_stop = (
        db.query(RouteStop)
        .join(Route, Route.id == RouteStop.route_id)
        .filter(
            RouteStop.bin_id  == bin_id,
            RouteStop.collected_at == None,          # ainda não coletada
            Route.locked      == True,               # rota travada
            Route.status.in_([
                RouteStatusEnum.planejada,
                RouteStatusEnum.ativa,
            ]),
        )
        .first()
    )

    route_locked = active_stop is not None

    return {
        "bin_id":       bin_id,
        "level":        bin_.level,
        "priority":     bin_.priority,
        "status":       bin_.status,
        "route_locked": route_locked,
        "message": (
            "Nível atualizado. Esta lixeira está em rota travada — "
            "o percurso do caminhão não foi alterado."
            if route_locked else
            "Nível atualizado com sucesso."
        ),
    }
"""

# ─────────────────────────────────────────────────────────
#  ARQUIVO COMPLETO — bins.py com proteção de rota travada
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.infrastructure.database.database import get_db
from app.domain.entities.bin   import Bin, PriorityEnum, BinStatusEnum
from app.domain.entities.route import Route, RouteStop, RouteStatusEnum
from app.core.security         import get_current_user

router = APIRouter(prefix="/bins", tags=["Bins"])


class BinResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    zone: Optional[str]
    latitude: float
    longitude: float
    level: float
    priority: PriorityEnum
    status: BinStatusEnum
    last_collected: Optional[datetime]

    class Config:
        from_attributes = True


class BinCreate(BaseModel):
    name: str
    location: Optional[str] = None
    zone: Optional[str] = None
    latitude: float
    longitude: float


class SensorUpdateSchema(BaseModel):
    raw_cm: float
    bin_height_cm: float = 100.0


@router.get("/", response_model=list[BinResponse])
def list_bins(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Bin).order_by(Bin.level.desc()).all()


@router.get("/{bin_id}", response_model=BinResponse)
def get_bin(
    bin_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    bin_ = db.query(Bin).filter(Bin.id == bin_id).first()
    if not bin_:
        raise HTTPException(status_code=404, detail="Lixeira não encontrada")
    return bin_


@router.post("/", response_model=BinResponse, status_code=201)
def create_bin(
    data: BinCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_bin = Bin(**data.model_dump(), level=0.0)
    new_bin.priority = new_bin.calculate_priority()
    db.add(new_bin)
    db.commit()
    db.refresh(new_bin)
    return new_bin


@router.post("/{bin_id}/sensor")
def receive_sensor_data(
    bin_id: int,
    data: SensorUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Recebe leitura do ESP32.
    Atualiza nível e prioridade no banco SEMPRE.
    Mas se a lixeira estiver em rota TRAVADA,
    o percurso do caminhão NÃO é alterado.
    """
    bin_ = db.query(Bin).filter(Bin.id == bin_id).first()
    if not bin_:
        raise HTTPException(status_code=404, detail="Lixeira não encontrada")

    # Calcula nível a partir da distância do sensor
    level = max(0.0, min(100.0, (1 - data.raw_cm / data.bin_height_cm) * 100))
    bin_.level    = round(level, 1)
    bin_.priority = bin_.calculate_priority()

    if level > 95:
        bin_.status = BinStatusEnum.cheia
    elif bin_.status == BinStatusEnum.cheia and level <= 10:
        bin_.status = BinStatusEnum.ativa  # foi coletada

    db.commit()

    # Verifica se está em rota travada (não modifica a rota)
    active_stop = (
        db.query(RouteStop)
        .join(Route, Route.id == RouteStop.route_id)
        .filter(
            RouteStop.bin_id       == bin_id,
            RouteStop.collected_at == None,
            Route.locked           == True,
            Route.status.in_([RouteStatusEnum.planejada, RouteStatusEnum.ativa]),
        )
        .first()
    )

    return {
        "bin_id":       bin_id,
        "level":        bin_.level,
        "priority":     bin_.priority,
        "status":       bin_.status,
        "route_locked": active_stop is not None,
        "message": (
            "Nível atualizado. Rota travada — percurso do caminhão mantido."
            if active_stop else
            "Nível atualizado com sucesso."
        ),
    }
