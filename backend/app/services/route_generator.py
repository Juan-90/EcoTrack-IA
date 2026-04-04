# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — services/route_generator.py
#
#  Algoritmo de geração automática de rotas por
#  PROXIMIDADE GEOGRÁFICA (Nearest Neighbor Heuristic)
#
#  Fluxo:
#  1. Filtra lixeiras acima do nível mínimo do turno
#  2. Tira snapshot dos níveis atuais
#  3. Distribui por caminhões disponíveis via clustering
#  4. Para cada caminhão: ordena paradas por proximidade
#  5. Salva rotas TRAVADAS no banco
# ─────────────────────────────────────────────────────────
import math
import json
from datetime import datetime
from typing import List
from sqlalchemy.orm import Session

from app.domain.entities.bin    import Bin, PriorityEnum
from app.domain.entities.truck  import Truck, TruckStatusEnum
from app.domain.entities.route  import Route, RouteStop, RouteStatusEnum
from app.domain.entities.shift  import Shift


# ── Funções geográficas ───────────────────────────────────

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Distância em km entre dois pontos GPS (fórmula Haversine).
    Usada para calcular proximidade entre lixeiras e ordenar paradas.
    """
    R = 6371.0
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    dφ = math.radians(lat2 - lat1)
    dλ = math.radians(lon2 - lon1)
    a  = math.sin(dφ/2)**2 + math.cos(φ1) * math.cos(φ2) * math.sin(dλ/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def nearest_neighbor_route(bins: List[Bin]) -> List[Bin]:
    """
    Algoritmo Nearest Neighbor (vizinho mais próximo).
    Parte da lixeira mais cheia e vai sempre para a mais próxima.

    Não é ótimo (seria NP-Hard), mas é rápido e bom o suficiente
    para o contexto do projeto. Em versões futuras pode usar OR-Tools.
    """
    if not bins:
        return []

    # Começa pela lixeira com maior nível
    unvisited = sorted(bins, key=lambda b: b.level, reverse=True)
    route     = [unvisited.pop(0)]

    while unvisited:
        current = route[-1]
        # Encontra a não-visitada mais próxima da atual
        nearest = min(
            unvisited,
            key=lambda b: haversine_km(
                current.latitude, current.longitude,
                b.latitude, b.longitude
            )
        )
        route.append(nearest)
        unvisited.remove(nearest)

    return route


def calculate_route_distance(bins: List[Bin]) -> float:
    """Calcula distância total da rota em km."""
    total = 0.0
    for i in range(len(bins) - 1):
        total += haversine_km(
            bins[i].latitude, bins[i].longitude,
            bins[i+1].latitude, bins[i+1].longitude
        )
    return round(total, 2)


def distribute_bins_to_trucks(
    bins: List[Bin],
    trucks: List[Truck],
) -> dict[int, List[Bin]]:
    """
    Distribui lixeiras entre os caminhões disponíveis.
    Estratégia: clustering por proximidade geográfica
    usando centróides — agrupa lixeiras próximas e
    atribui cada cluster a um caminhão.

    Para N caminhões, divide o espaço em N grupos
    minimizando a distância total percorrida.
    """
    if not trucks or not bins:
        return {}

    n_trucks = len(trucks)

    if n_trucks == 1:
        return {trucks[0].id: bins}

    # Inicializa centróides com as N lixeiras mais cheias
    seeds      = sorted(bins, key=lambda b: b.level, reverse=True)[:n_trucks]
    centroids  = [(b.latitude, b.longitude) for b in seeds]
    assignment = {t.id: [] for t in trucks}

    # K-Means simplificado (5 iterações é suficiente)
    for _ in range(5):
        assignment = {t.id: [] for t in trucks}

        for bin_ in bins:
            distances = [
                haversine_km(bin_.latitude, bin_.longitude, c[0], c[1])
                for c in centroids
            ]
            closest_idx = distances.index(min(distances))
            assignment[trucks[closest_idx].id].append(bin_)

        # Recalcula centróides
        for i, truck in enumerate(trucks):
            cluster = assignment[truck.id]
            if cluster:
                centroids[i] = (
                    sum(b.latitude  for b in cluster) / len(cluster),
                    sum(b.longitude for b in cluster) / len(cluster),
                )

    return assignment


# ── Função principal ──────────────────────────────────────

def generate_routes_for_shift(shift: Shift, db: Session) -> List[Route]:
    """
    Gera todas as rotas para um turno.
    Chamada pelo scheduler automático ou manualmente.

    Retorna lista de Route criadas e travadas.
    """
    now = datetime.now()

    # 1. Verifica se já existe rota gerada para este turno hoje
    today_routes = db.query(Route).filter(
        Route.shift_id == shift.id,
        # Geradas hoje
    ).all()
    already_today = [
        r for r in today_routes
        if r.created_at and r.created_at.date() == now.date()
    ]
    if already_today:
        raise ValueError(
            f"Turno '{shift.name}' já teve rotas geradas hoje. "
            f"Exclua as rotas existentes para gerar novamente."
        )

    # 2. Busca lixeiras elegíveis (acima do nível mínimo do turno)
    eligible_bins = db.query(Bin).filter(
        Bin.level >= shift.min_fill_level,
        Bin.status.in_(["ativa", "cheia"]),
    ).order_by(Bin.level.desc()).all()

    if not eligible_bins:
        return []

    # 3. Busca caminhões disponíveis
    available_trucks = db.query(Truck).filter(
        Truck.status == TruckStatusEnum.aguardando
    ).all()

    if not available_trucks:
        raise ValueError("Nenhum caminhão disponível para este turno.")

    # 4. Tira SNAPSHOT dos níveis atuais — congela o estado
    bins_snapshot = [
        {
            "bin_id":   b.id,
            "name":     b.name,
            "level":    b.level,
            "priority": b.priority,
            "lat":      b.latitude,
            "lon":      b.longitude,
        }
        for b in eligible_bins
    ]

    # 5. Distribui lixeiras por caminhão (clustering geográfico)
    distribution = distribute_bins_to_trucks(eligible_bins, available_trucks)

    # 6. Para cada caminhão: ordena por proximidade e cria rota
    created_routes = []

    for truck in available_trucks:
        truck_bins = distribution.get(truck.id, [])
        if not truck_bins:
            continue

        # Ordena paradas por proximidade geográfica (Nearest Neighbor)
        ordered_bins = nearest_neighbor_route(truck_bins)
        distance_km  = calculate_route_distance(ordered_bins)

        # Cria a rota já TRAVADA
        route = Route(
            truck_id        = truck.id,
            shift_id        = shift.id,
            status          = RouteStatusEnum.planejada,
            scheduled_start = shift.scheduled_time,
            scheduled_end   = shift.end_time,
            total_distance_km = distance_km,
            locked          = True,          # ← TRAVADA desde a criação
            bins_snapshot   = bins_snapshot,  # ← snapshot do momento
            created_at      = now,
        )
        db.add(route)
        db.flush()

        # Cria as paradas na ordem otimizada
        for order, bin_ in enumerate(ordered_bins, start=1):
            db.add(RouteStop(
                route_id = route.id,
                bin_id   = bin_.id,
                order    = order,
            ))

        created_routes.append(route)

    db.commit()

    for r in created_routes:
        db.refresh(r)

    return created_routes
