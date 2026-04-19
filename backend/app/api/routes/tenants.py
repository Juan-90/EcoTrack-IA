# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/tenants.py
#  Endpoint de validação de tenant para login multi-tenant
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/tenants", tags=["Tenants"])

# Mock de tenants — substituir por banco real futuramente
TENANTS = {
    "46395000000139": {
        "id":      "46395000000139",
        "name":    "Prefeitura de São Paulo",
        "city":    "São Paulo",
        "state":   "SP",
        "plan":    "enterprise",
        "active":  True,
    },
    "69597457000155": {
        "id":      "69597457000155",
        "name":    "Prefeitura de Campinas",
        "city":    "Campinas",
        "state":   "SP",
        "plan":    "profissional",
        "active":  True,
    },
    "001": {
        "id":      "001",
        "name":    "EcoTrack Demo",
        "city":    "Demo",
        "state":   "SP",
        "plan":    "basico",
        "active":  True,
    },
}


class TenantValidateRequest(BaseModel):
    tenant_id: str


@router.post("/validate")
def validate_tenant(data: TenantValidateRequest):
    """
    Valida se um tenant existe e está ativo.
    Chamado antes do login — retorna dados da organização.
    """
    # Remove formatação (pontos, barras, traços)
    clean_id = data.tenant_id.replace(".", "").replace(
        "/", "").replace("-", "").strip()

    tenant = TENANTS.get(clean_id) or TENANTS.get(data.tenant_id.strip())

    if not tenant:
        raise HTTPException(
            status_code=404,
            detail="Organização não encontrada. Verifique o CNPJ ou ID."
        )

    if not tenant["active"]:
        raise HTTPException(
            status_code=403,
            detail="Organização inativa. Entre em contato com o suporte."
        )

    return tenant