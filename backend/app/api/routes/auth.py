from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.domain.entities.user import User
from app.infrastructure.database.database import SessionLocal

router = APIRouter()


class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    role: Optional[str] = "collector"


class OAuth2TenantPasswordRequestForm:
    def __init__(
        self,
        tenant: str = Form(...),
        username: str = Form(...),
        password: str = Form(...),
    ):
        self.tenant = tenant
        self.username = username
        self.password = password


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def normalize_tenant_identifier(value: str) -> str:
    trimmed = value.strip()

    if not trimmed:
        return ""

    only_digits = "".join(ch for ch in trimmed if ch.isdigit())

    if len(only_digits) == 14:
        return only_digits

    return trimmed.upper()


def resolve_tenant(identifier: str) -> Optional[dict]:
    normalized = normalize_tenant_identifier(identifier)

    tenants = {
        "001": {
            "id": 1,
            "code": "001",
            "name": "EcoTrack Demo",
            "type": "empresa",
            "document": "001",
            "status": "active",
        },
        "46395000000139": {
            "id": 2,
            "code": "46395000000139",
            "name": "Prefeitura de São Paulo",
            "type": "prefeitura",
            "document": "46.395.000/0001-39",
            "status": "active",
        },
    }

    return tenants.get(normalized)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        hashed_password=hashed,
    )

    if hasattr(new_user, "name"):
        setattr(new_user, "name", user.name or "Usuário EcoTrack")

    if hasattr(new_user, "role"):
        setattr(new_user, "role", user.role or "collector")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuário criado com sucesso"}


@router.post("/login")
def login(
    form_data: OAuth2TenantPasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    tenant = resolve_tenant(form_data.tenant)

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")

    if tenant["status"] != "active":
        raise HTTPException(status_code=403, detail="Tenant inativo")

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    user_tenant_id = getattr(user, "tenant_id", None)
    if user_tenant_id is not None and user_tenant_id != tenant["id"]:
        raise HTTPException(
            status_code=403,
            detail="Usuário não pertence ao tenant informado",
        )

    user_name = getattr(user, "name", None) or "Usuário Teste"
    user_role = getattr(user, "role", None) or "collector"

    access_token = create_access_token(
        data={
            "sub": user.email,
            "tenant_id": tenant["id"],
            "tenant_code": tenant["code"],
            "role": user_role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user_name,
            "email": user.email,
            "role": user_role,
        },
        "tenant": {
            "id": tenant["id"],
            "name": tenant["name"],
            "type": tenant["type"],
            "document": tenant["document"],
        },
    }
