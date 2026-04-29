from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/company", tags=["Company Dashboard"])

COMPANY_CLIENTS = [
    {
        "id": "46395000000139",
        "name": "Prefeitura de Sao Paulo",
        "slug": "prefeitura-sao-paulo",
        "type": "Prefeitura",
        "status": "Ativo",
        "city": "Sao Paulo",
        "state": "SP",
        "plan": "Enterprise",
        "activatedAt": "2026-01-12",
        "monthlyRevenue": 42000,
        "activeUsers": 186,
        "monitoredBins": 1240,
        "collectionEfficiency": 94,
        "licenseUsage": 81,
        "deploymentStatus": "Online",
        "version": "v2.8.1",
        "uptime": "99.98%",
        "contractEndsAt": "2027-01-12",
        "internalOwner": "Juan Andrade",
    },
    {
        "id": "69597457000155",
        "name": "Prefeitura de Campinas",
        "slug": "prefeitura-campinas",
        "type": "Prefeitura",
        "status": "Atenção",
        "city": "Campinas",
        "state": "SP",
        "plan": "Pro",
        "activatedAt": "2025-10-04",
        "monthlyRevenue": 18000,
        "activeUsers": 73,
        "monitoredBins": 540,
        "collectionEfficiency": 88,
        "licenseUsage": 77,
        "deploymentStatus": "Degradado",
        "version": "v2.7.4",
        "uptime": "98.91%",
        "contractEndsAt": "2026-10-04",
        "internalOwner": "Mauricio Ferreira",
    },
    {
        "id": "001",
        "name": "EcoTrack Demo",
        "slug": "ecotrack-demo",
        "type": "Empresa de coleta",
        "status": "Onboarding",
        "city": "Pouso Alegre",
        "state": "MG",
        "plan": "Basic",
        "activatedAt": "2026-04-01",
        "monthlyRevenue": 6000,
        "activeUsers": 14,
        "monitoredBins": 96,
        "collectionEfficiency": 79,
        "licenseUsage": 62,
        "deploymentStatus": "Online",
        "version": "v2.8.1",
        "uptime": "99.40%",
        "contractEndsAt": "2027-04-01",
        "internalOwner": "Caio Mattos",
    },
    {
        "id": "88421009000120",
        "name": "Coleta Verde Ambiental",
        "slug": "coleta-verde-ambiental",
        "type": "Empresa de coleta",
        "status": "Ativo",
        "city": "Ribeirao Preto",
        "state": "SP",
        "plan": "Pro",
        "activatedAt": "2025-08-19",
        "monthlyRevenue": 14000,
        "activeUsers": 38,
        "monitoredBins": 320,
        "collectionEfficiency": 90,
        "licenseUsage": 92,
        "deploymentStatus": "Online",
        "version": "v2.8.0",
        "uptime": "99.82%",
        "contractEndsAt": "2026-08-19",
        "internalOwner": "Nelson Sousa",
    },
]

COMPANY_DEPLOYMENTS = [
    {
        "id": "dep-sp-prod",
        "clientSlug": "prefeitura-sao-paulo",
        "clientName": "Prefeitura de Sao Paulo",
        "environment": "Production",
        "status": "Online",
        "version": "v2.8.1",
        "uptime": 99.98,
        "region": "sa-east-1",
        "latencyMs": 84,
        "errorRate": 0.08,
        "lastIncidentAt": None,
        "lastDeployAt": "2026-04-27T11:40:00",
        "internalOwner": "Juan Andrade",
    },
    {
        "id": "dep-cps-prod",
        "clientSlug": "prefeitura-campinas",
        "clientName": "Prefeitura de Campinas",
        "environment": "Production",
        "status": "Degradado",
        "version": "v2.7.4",
        "uptime": 98.91,
        "region": "sa-east-1",
        "latencyMs": 241,
        "errorRate": 2.18,
        "lastIncidentAt": "2026-04-28T17:20:00",
        "lastDeployAt": "2026-04-22T09:15:00",
        "internalOwner": "Mauricio Ferreira",
    },
    {
        "id": "dep-demo-stg",
        "clientSlug": "ecotrack-demo",
        "clientName": "EcoTrack Demo",
        "environment": "Staging",
        "status": "Online",
        "version": "v2.8.1",
        "uptime": 99.4,
        "region": "local-lab",
        "latencyMs": 132,
        "errorRate": 0.24,
        "lastIncidentAt": None,
        "lastDeployAt": "2026-04-26T19:10:00",
        "internalOwner": "Caio Mattos",
    },
]

INTERNAL_USERS = [
    {
        "id": "usr-1",
        "name": "Juan Andrade",
        "role": "Founder Admin",
        "email": "juan@ecotrack.com",
        "status": "Ativo",
        "scope": "Comercial, plataforma e estrategia",
        "lastAccessAt": "2026-04-29T09:10:00",
    },
    {
        "id": "usr-2",
        "name": "Caio Mattos",
        "role": "Backend Lead",
        "email": "caio@ecotrack.com",
        "status": "Ativo",
        "scope": "Backend, releases e dados",
        "lastAccessAt": "2026-04-29T08:25:00",
    },
    {
        "id": "usr-3",
        "name": "Mauricio Ferreira",
        "role": "IoT Operations",
        "email": "mauricio@ecotrack.com",
        "status": "Ativo",
        "scope": "Operacao de campo e deployments",
        "lastAccessAt": "2026-04-29T07:55:00",
    },
]

PERMISSION_PROFILES = [
    {
        "id": "perm-1",
        "name": "Founder Admin",
        "description": "Acesso completo a operacao, contratos, usuarios e configuracoes.",
        "members": 1,
        "capabilities": ["billing.write", "users.manage", "deployments.manage", "tenants.manage"],
    },
    {
        "id": "perm-2",
        "name": "Operations Manager",
        "description": "Opera a base de clientes e monitora saude dos ambientes.",
        "members": 1,
        "capabilities": ["deployments.read", "deployments.manage", "tenants.read", "reports.export"],
    },
]

OPERATIONAL_CARDS = [
    {
        "label": "Playbooks ativos",
        "value": "12",
        "detail": "Runbooks operacionais para incidentes, onboarding e rollout.",
    },
    {
        "label": "Integracoes prioritarias",
        "value": "4",
        "detail": "Billing, observabilidade, CRM e autenticacao corporativa.",
    },
    {
        "label": "Ambientes monitorados",
        "value": "9",
        "detail": "Entre producao, staging e pilotos acompanhados internamente.",
    },
    {
        "label": "SLA interno",
        "value": "99.5%",
        "detail": "Meta operacional para a plataforma EcoTrack Company.",
    },
]


@router.get("/clients")
def get_company_clients():
    return COMPANY_CLIENTS


@router.get("/clients/{slug}")
def get_company_client_by_slug(slug: str):
    for client in COMPANY_CLIENTS:
        if client["slug"] == slug:
            return client
    raise HTTPException(status_code=404, detail="Cliente nao encontrado")


@router.get("/deployments")
def get_company_deployments():
    return COMPANY_DEPLOYMENTS


@router.get("/internal-users")
def get_company_internal_users():
    return INTERNAL_USERS


@router.get("/permission-profiles")
def get_company_permission_profiles():
    return PERMISSION_PROFILES


@router.get("/operational-cards")
def get_company_operational_cards():
    return OPERATIONAL_CARDS
