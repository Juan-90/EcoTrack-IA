# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — api/routes/analytics.py
#  Retorna os KPIs do dashboard web E mobile:
#  total_bins=42, full_bins=8, collections_today=17, efficiency=91%
#  Gráficos: coletas por dia e nível médio por hora
# ─────────────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta

from app.infrastructure.database.database import get_db
from app.domain.entities.bin        import Bin, PriorityEnum
from app.domain.entities.collection import Collection
from app.core.security              import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

DIAS_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
HORAS   = ["08h", "10h", "12h", "14h", "16h", "18h"]


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    today = date.today()
    bins  = db.query(Bin).all()

    # ── KPIs ─────────────────────────────────────────────
    total_bins = len(bins)
    full_bins  = sum(1 for b in bins if b.level > 80)
    avg_level  = round(sum(b.level for b in bins) / total_bins, 1) if total_bins else 0

    collections_today = db.query(Collection).filter(
        func.date(Collection.timestamp) == today
    ).count()

    # Eficiência: % de coletas concluídas nas lixeiras de prioridade alta
    alta_bins      = sum(1 for b in bins if b.priority == PriorityEnum.alta)
    collected_alta = db.query(Collection).filter(
        func.date(Collection.timestamp) == today
    ).count()
    efficiency_pct = round((collected_alta / alta_bins * 100), 1) if alta_bins else 100.0

    # ── Coletas por dia (últimos 7 dias) ─────────────────
    collections_per_day = []
    for i in range(6, -1, -1):
        day     = today - timedelta(days=i)
        count   = db.query(Collection).filter(
            func.date(Collection.timestamp) == day
        ).count()
        weekday = DIAS_PT[day.weekday()]
        collections_per_day.append({"label": weekday, "count": count})

    # ── Nível médio por hora (hoje) ───────────────────────
    # Simula distribuição ao longo do dia com base no avg_level atual
    # Quando o sensor enviar dados históricos, usar dados reais
    base = max(10, avg_level - 40)
    level_by_hour = [
        {"label": HORAS[0], "level": round(base + 0)},
        {"label": HORAS[1], "level": round(base + 8)},
        {"label": HORAS[2], "level": round(base + 18)},
        {"label": HORAS[3], "level": round(base + 28)},
        {"label": HORAS[4], "level": round(base + 33)},
        {"label": HORAS[5], "level": min(100, round(base + 45))},
    ]

    # ── Lixeiras críticas com previsão ───────────────────
    critical_bins = [
        {
            "name": b.name,
            "level": b.level,
            # predictFillTime: mesma lógica do mobile (10%/hora)
            "predicted_full_in_h": round((100 - b.level) / 10, 1),
        }
        for b in sorted(bins, key=lambda x: x.level, reverse=True)
        if b.level >= 70
    ][:5]

    return {
        "total_bins":           total_bins,
        "full_bins":            full_bins,
        "collections_today":    collections_today,
        "efficiency_pct":       efficiency_pct,
        "avg_level":            avg_level,
        "collections_per_day":  collections_per_day,
        "level_by_hour":        level_by_hour,
        "critical_bins":        critical_bins,
    }
