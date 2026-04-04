# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/shifts.py
#  CRUD de turnos + geração manual de rotas
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import time, datetime

from app.infrastructure.database.database import get_db
from app.domain.entities.shift            import Shift
from app.services.route_generator         import generate_routes_for_shift
from app.core.security                    import get_current_user

router = APIRouter(prefix="/shifts", tags=["Shifts"])

DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]


# ── Schemas ───────────────────────────────────────────────
class ShiftCreate(BaseModel):
    name:            str
    scheduled_time:  str        # "HH:MM"
    end_time:        str        # "HH:MM"
    active_days:     list[int]  # [0,1,2,3,4] = seg–sex
    min_fill_level:  int = 50   # % mínimo para incluir lixeira

    @field_validator("active_days")
    def validate_days(cls, v):
        if not all(0 <= d <= 6 for d in v):
            raise ValueError("Dias devem ser entre 0 (seg) e 6 (dom)")
        return v

    @field_validator("min_fill_level")
    def validate_level(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("Nível deve ser entre 0 e 100")
        return v


class ShiftUpdate(BaseModel):
    name:           Optional[str]       = None
    scheduled_time: Optional[str]       = None
    end_time:       Optional[str]       = None
    active_days:    Optional[list[int]] = None
    min_fill_level: Optional[int]       = None
    is_active:      Optional[bool]      = None


class ShiftResponse(BaseModel):
    id:             int
    name:           str
    scheduled_time: str
    end_time:       str
    active_days:    list[int]
    active_days_label: list[str]   # ["Segunda", "Terça", ...]
    min_fill_level: int
    is_active:      bool

    class Config:
        from_attributes = True


def _to_response(shift: Shift) -> dict:
    return {
        "id":               shift.id,
        "name":             shift.name,
        "scheduled_time":   shift.scheduled_time.strftime("%H:%M"),
        "end_time":         shift.end_time.strftime("%H:%M"),
        "active_days":      shift.active_days,
        "active_days_label":[DIAS_SEMANA[d] for d in (shift.active_days or [])],
        "min_fill_level":   shift.min_fill_level,
        "is_active":        shift.is_active,
    }


def _parse_time(t: str) -> time:
    try:
        h, m = t.split(":")
        return time(int(h), int(m))
    except Exception:
        raise HTTPException(status_code=400, detail=f"Formato de horário inválido: '{t}'. Use HH:MM")


# ── Endpoints ─────────────────────────────────────────────

# GET /shifts
@router.get("/")
def list_shifts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return [_to_response(s) for s in db.query(Shift).all()]


# GET /shifts/{id}
@router.get("/{shift_id}")
def get_shift(
    shift_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Turno não encontrado")
    return _to_response(shift)


# POST /shifts — criar turno
@router.post("/", status_code=201)
def create_shift(
    data: ShiftCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shift = Shift(
        name           = data.name,
        scheduled_time = _parse_time(data.scheduled_time),
        end_time       = _parse_time(data.end_time),
        active_days    = data.active_days,
        min_fill_level = data.min_fill_level,
        is_active      = True,
    )
    db.add(shift)
    db.commit()
    db.refresh(shift)
    return _to_response(shift)


# PATCH /shifts/{id} — editar turno
@router.patch("/{shift_id}")
def update_shift(
    shift_id: int,
    data: ShiftUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Turno não encontrado")

    if data.name           is not None: shift.name           = data.name
    if data.active_days    is not None: shift.active_days    = data.active_days
    if data.min_fill_level is not None: shift.min_fill_level = data.min_fill_level
    if data.is_active      is not None: shift.is_active      = data.is_active
    if data.scheduled_time is not None: shift.scheduled_time = _parse_time(data.scheduled_time)
    if data.end_time       is not None: shift.end_time       = _parse_time(data.end_time)

    db.commit()
    db.refresh(shift)
    return _to_response(shift)


# DELETE /shifts/{id}
@router.delete("/{shift_id}", status_code=204)
def delete_shift(
    shift_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Turno não encontrado")
    db.delete(shift)
    db.commit()


# POST /shifts/{id}/generate — disparo manual (botão no painel)
@router.post("/{shift_id}/generate")
def manual_generate(
    shift_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Geração manual de rotas pelo gestor.
    Útil para recriar rotas em caso de necessidade
    ou para testar o sistema fora do horário automático.
    """
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Turno não encontrado")

    try:
        routes = generate_routes_for_shift(shift, db)
        return {
            "message":   f"{len(routes)} rota(s) gerada(s) com sucesso",
            "shift":     shift.name,
            "routes":    [{"id": r.id, "truck_id": r.truck_id, "stops": len(r.stops)} for r in routes],
            "generated_at": datetime.now().isoformat(),
        }
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
