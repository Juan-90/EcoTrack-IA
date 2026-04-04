# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/trucks.py
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.infrastructure.database.database import get_db
from app.domain.entities.truck import Truck, TruckStatusEnum
from app.core.security import get_current_user

router = APIRouter(prefix="/trucks", tags=["Trucks"])


class TruckResponse(BaseModel):
    id: int
    plate: str
    driver: str
    capacity_kg: float
    current_load_kg: float
    current_route_id: Optional[int]
    status: TruckStatusEnum
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True


class TruckCreate(BaseModel):
    plate: str
    driver: str
    capacity_kg: float = 8000.0


class LocationUpdate(BaseModel):
    """Atualização de posição GPS do caminhão (enviada pelo app mobile)."""
    latitude: float
    longitude: float
    current_load_kg: Optional[float] = None


# GET /trucks
@router.get("/", response_model=list[TruckResponse])
def list_trucks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Truck).all()


# GET /trucks/{id}
@router.get("/{truck_id}", response_model=TruckResponse)
def get_truck(
    truck_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Caminhão não encontrado")
    return truck


# POST /trucks
@router.post("/", response_model=TruckResponse, status_code=201)
def create_truck(
    data: TruckCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if db.query(Truck).filter(Truck.plate == data.plate).first():
        raise HTTPException(status_code=400, detail="Placa já cadastrada")
    truck = Truck(**data.model_dump())
    db.add(truck)
    db.commit()
    db.refresh(truck)
    return truck


# PATCH /trucks/{id}/location — app mobile envia GPS em tempo real
@router.patch("/{truck_id}/location")
def update_location(
    truck_id: int,
    data: LocationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Caminhão não encontrado")

    truck.latitude  = data.latitude
    truck.longitude = data.longitude
    if data.current_load_kg is not None:
        truck.current_load_kg = data.current_load_kg

    db.commit()
    return {"ok": True}
