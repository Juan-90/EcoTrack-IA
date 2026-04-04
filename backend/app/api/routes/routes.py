# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/routes.py
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

from app.infrastructure.database.database import get_db
from app.domain.entities.route import Route, RouteStop, RouteStatusEnum
from app.domain.entities.truck import Truck, TruckStatusEnum
from app.domain.entities.bin   import Bin, BinStatusEnum
from app.domain.entities.collection import Collection
from app.core.security import get_current_user

router = APIRouter(prefix="/routes", tags=["Routes"])


# ── Schemas ───────────────────────────────────────────────
class RouteStopResponse(BaseModel):
    bin_id: int
    order: int
    collected_at: Optional[datetime]

    class Config:
        from_attributes = True


class RouteResponse(BaseModel):
    id: int
    truck_id: int
    status: RouteStatusEnum
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    total_distance_km: Optional[float]
    stops: list[RouteStopResponse]

    class Config:
        from_attributes = True


class RouteCreate(BaseModel):
    truck_id: int
    bin_ids: list[int]   # ordem da lista define a ordem das paradas


# ── Rotas ─────────────────────────────────────────────────

# GET /routes/today — rotas do dia (usada pelo dashboard web)
@router.get("/today", response_model=list[RouteResponse])
def get_today_routes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    today = date.today()
    routes = db.query(Route).filter(
        Route.status.in_([RouteStatusEnum.ativa, RouteStatusEnum.planejada])
    ).all()

    # Filtra por data de hoje
    today_routes = [
        r for r in routes
        if r.start_time and r.start_time.date() == today
        or r.status == RouteStatusEnum.planejada
    ]
    return today_routes


# GET /routes — todas as rotas
@router.get("/", response_model=list[RouteResponse])
def list_routes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Route).order_by(Route.id.desc()).all()


# GET /routes/{id}
@router.get("/{route_id}", response_model=RouteResponse)
def get_route(
    route_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    return route


# POST /routes — criar nova rota
@router.post("/", response_model=RouteResponse, status_code=201)
def create_route(
    data: RouteCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    truck = db.query(Truck).filter(Truck.id == data.truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Caminhão não encontrado")

    route = Route(truck_id=data.truck_id, status=RouteStatusEnum.planejada)
    db.add(route)
    db.flush()

    for i, bin_id in enumerate(data.bin_ids):
        if not db.query(Bin).filter(Bin.id == bin_id).first():
            raise HTTPException(status_code=404, detail=f"Lixeira {bin_id} não encontrada")
        db.add(RouteStop(route_id=route.id, bin_id=bin_id, order=i + 1))

    db.commit()
    db.refresh(route)
    return route


# POST /routes/{id}/start — iniciar rota
@router.post("/{route_id}/start")
def start_route(
    route_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Rota não encontrada")

    route.status     = RouteStatusEnum.ativa
    route.start_time = datetime.now()

    truck = db.query(Truck).filter(Truck.id == route.truck_id).first()
    if truck:
        truck.status           = TruckStatusEnum.em_rota
        truck.current_route_id = route.id

    db.commit()
    return {"ok": True, "route_id": route_id}


# POST /routes/{id}/stops/{bin_id}/collect — marcar lixeira como coletada
@router.post("/{route_id}/stops/{bin_id}/collect")
def collect_bin(
    route_id: int,
    bin_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    stop = db.query(RouteStop).filter(
        RouteStop.route_id == route_id,
        RouteStop.bin_id   == bin_id,
    ).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Parada não encontrada")

    now = datetime.now()
    stop.collected_at = now

    # Atualiza a lixeira: zera nível, muda prioridade e status
    bin_ = db.query(Bin).filter(Bin.id == bin_id).first()
    if bin_:
        bin_.level         = 0.0
        bin_.priority      = bin_.calculate_priority()
        bin_.status        = BinStatusEnum.ativa
        bin_.last_collected = now

    # Registra no histórico de coletas
    route = db.query(Route).filter(Route.id == route_id).first()
    db.add(Collection(
        bin_id=bin_id,
        truck_id=route.truck_id if route else None,
        level_at_collection=bin_.level if bin_ else 0,
        timestamp=now,
    ))

    db.commit()
    return {"ok": True, "collected_at": now}
