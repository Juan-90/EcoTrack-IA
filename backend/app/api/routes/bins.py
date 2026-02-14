from fastapi import APIRouter

router = APIRouter(prefix="/bins", tags=["Bins"])

@router.get("/")
def get_bins():
    return [{"id": 1, "level": 65, "location": "Centro"}]