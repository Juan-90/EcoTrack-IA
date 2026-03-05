from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/bins", tags=["Bins"])

# Banco fake (para MVP)
bins_db = [
    {"id": 1, "location": "Centro", "fillLevel": 72},
    {"id": 2, "location": "Praça", "fillLevel": 34},
    {"id": 3, "location": "Escola", "fillLevel": 90},
]

# 📦 LISTAR LIXEIRAS
@router.get("/")
def list_bins(current_user = Depends(get_current_user)):
    return bins_db


# 📦 DETALHE DA LIXEIRA
@router.get("/{bin_id}")
def get_bin(bin_id: int, current_user = Depends(get_current_user)):
    for b in bins_db:
        if b["id"] == bin_id:
            return b
    return {"error": "Lixeira não encontrada"}