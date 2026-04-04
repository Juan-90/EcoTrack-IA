from app.infrastructure.database.database import SessionLocal, create_tables
from app.domain.entities.bin        import Bin, PriorityEnum, BinStatusEnum
from app.domain.entities.truck      import Truck, TruckStatusEnum
from app.domain.entities.route      import Route, RouteStop, RouteStatusEnum
from app.domain.entities.collection import Collection
from app.domain.entities.user       import User
from app.core.security              import hash_password
from datetime import datetime, timedelta


def seed():
    create_tables()
    db = SessionLocal()

    if db.query(Bin).count() > 0:
        print("⚠️  Banco já populado. Pulando seed.")
        db.close()
        return

    print("🌱 Populando banco de dados...")

    admin = User(
        email="admin@ecotrack.com",
        hashed_password=hash_password("123456"),
    )
    db.add(admin)

    bins_data = [
        dict(name="Hospital",          location="Av. Hospital, 100",        zone="Centro",  latitude=-22.1234, longitude=-45.9876, level=92),
        dict(name="Praça Central",     location="Praça da República, s/n",  zone="Centro",  latitude=-22.1290, longitude=-45.9820, level=88),
        dict(name="Parque Municipal",  location="Rua do Parque, 500",       zone="Norte",   latitude=-22.1350, longitude=-45.9750, level=81),
        dict(name="Mercado Central",   location="Rua Comércio, 200",        zone="Centro",  latitude=-22.1200, longitude=-45.9900, level=74),
        dict(name="Escola Estadual",   location="Av. Educação, 350",        zone="Sul",     latitude=-22.1400, longitude=-45.9800, level=65),
        dict(name="Terminal de Ônibus",location="Rua Terminal, 1",          zone="Centro",  latitude=-22.1180, longitude=-45.9950, level=58),
        dict(name="Ginásio Esportivo", location="Av. Esportes, 800",        zone="Leste",   latitude=-22.1450, longitude=-45.9700, level=32),
        dict(name="Bairro Jardins",    location="Rua das Flores, 120",      zone="Jardins", latitude=-22.1500, longitude=-45.9650, level=18),
        dict(name="Biblioteca Pública",location="Rua Cultura, 45",          zone="Centro",  latitude=-22.1270, longitude=-45.9830, level=45),
        dict(name="UBS Norte",         location="Av. Saúde, 220",           zone="Norte",   latitude=-22.1100, longitude=-45.9770, level=77),
    ]

    bin_objs = []
    for d in bins_data:
        level = d["level"]
        if level > 80:
            priority = PriorityEnum.alta
            status   = BinStatusEnum.cheia
        elif level >= 50:
            priority = PriorityEnum.media
            status   = BinStatusEnum.ativa
        else:
            priority = PriorityEnum.baixa
            status   = BinStatusEnum.ativa

        b = Bin(
            **d,
            priority=priority,
            status=status,
            last_collected=datetime.now() - timedelta(hours=level / 10),
        )
        db.add(b)
        bin_objs.append(b)

    db.flush()

    trucks_data = [
        dict(plate="ABC-1234", driver="Carlos Oliveira", capacity_kg=8000, current_load_kg=6200, status=TruckStatusEnum.em_rota,    latitude=-22.1250, longitude=-45.9860),
        dict(plate="DEF-5678", driver="Marcos Lima",     capacity_kg=8000, current_load_kg=3100, status=TruckStatusEnum.em_rota,    latitude=-22.1380, longitude=-45.9780),
        dict(plate="GHI-9012", driver="Paulo Santos",    capacity_kg=6000, current_load_kg=6000, status=TruckStatusEnum.retornando, latitude=-22.1220, longitude=-45.9910),
        dict(plate="JKL-3456", driver="Roberto Alves",   capacity_kg=8000, current_load_kg=0,    status=TruckStatusEnum.manutencao),
    ]

    truck_objs = []
    for d in trucks_data:
        t = Truck(**d)
        db.add(t)
        truck_objs.append(t)

    db.flush()

    route1 = Route(
        truck_id=truck_objs[0].id,
        status=RouteStatusEnum.ativa,
        start_time=datetime.now() - timedelta(hours=1),
        total_distance_km=12.4,
    )
    db.add(route1)
    db.flush()

    for i, bin_idx in enumerate([0, 1, 3]):
        db.add(RouteStop(route_id=route1.id, bin_id=bin_objs[bin_idx].id, order=i + 1))

    route2 = Route(
        truck_id=truck_objs[1].id,
        status=RouteStatusEnum.ativa,
        start_time=datetime.now() - timedelta(minutes=45),
        total_distance_km=9.8,
    )
    db.add(route2)
    db.flush()

    for i, bin_idx in enumerate([2, 4, 9]):
        db.add(RouteStop(route_id=route2.id, bin_id=bin_objs[bin_idx].id, order=i + 1))

    daily_counts = [12, 19, 10, 15, 20, 14, 9]
    for days_ago, count in enumerate(reversed(daily_counts)):
        for _ in range(count):
            c = Collection(
                bin_id=bin_objs[_ % len(bin_objs)].id,
                truck_id=truck_objs[0].id,
                timestamp=datetime.now() - timedelta(days=days_ago, hours=_ % 8),
                level_at_collection=60 + (_ % 35),
            )
            db.add(c)

    db.commit()
    print(f"✅ Seed concluído!")
    print(f"   👤 Usuário: admin@ecotrack.com / 123456")
    print(f"   🗑️  {len(bin_objs)} lixeiras criadas")
    print(f"   🚛 {len(truck_objs)} caminhões criados")
    print(f"   🗺️  2 rotas ativas criadas")
    print(f"   📦 Histórico de coletas dos últimos 7 dias")
    db.close()


if __name__ == "__main__":
    seed()