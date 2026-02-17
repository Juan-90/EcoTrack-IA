from fastapi import APIRouter
from fastapi import Depends
from app.core.security import get_current_user



router = APIRouter(prefix="/bins", tags=["Bins"])

@router.get("/bins")
def list_bins(current_user = Depends(get_current_user)):
    return {"message": "Rota protegida funcionando 🔒"}