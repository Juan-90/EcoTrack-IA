# ─────────────────────────────────────────────────────────
#  EcoTrack-IA — core/scheduler.py
#
#  Scheduler automático com APScheduler.
#  Verifica a cada minuto se algum turno deve gerar rotas.
#  Registrado no startup do FastAPI (main.py).
# ─────────────────────────────────────────────────────────
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron         import CronTrigger

from app.infrastructure.database.database import SessionLocal
from app.domain.entities.shift            import Shift
from app.services.route_generator         import generate_routes_for_shift

scheduler = BackgroundScheduler(timezone="America/Sao_Paulo")


def check_and_generate_routes():
    """
    Executada a cada minuto pelo scheduler.
    Verifica se existe algum turno ativo cujo horário de geração
    coincide com o minuto atual — se sim, gera as rotas.
    """
    db  = SessionLocal()
    now = datetime.now()

    try:
        shifts = db.query(Shift).filter(Shift.is_active == True).all()

        for shift in shifts:
            # Verifica se hoje é um dia ativo para este turno
            if not shift.is_today_active(now.weekday()):
                continue

            # Verifica se o horário bate (ignora segundos)
            if (
                shift.scheduled_time.hour   == now.hour and
                shift.scheduled_time.minute == now.minute
            ):
                try:
                    routes = generate_routes_for_shift(shift, db)
                    print(
                        f"[EcoTrack Scheduler] ✅ Turno '{shift.name}' — "
                        f"{len(routes)} rota(s) gerada(s) às {now.strftime('%H:%M')}"
                    )
                except ValueError as e:
                    # Turno já gerado hoje ou sem caminhões — não é erro crítico
                    print(f"[EcoTrack Scheduler] ⚠️  Turno '{shift.name}': {e}")
                except Exception as e:
                    print(f"[EcoTrack Scheduler] ❌ Erro no turno '{shift.name}': {e}")

    finally:
        db.close()


def start_scheduler():
    """Inicia o scheduler. Chamado no startup do FastAPI."""
    scheduler.add_job(
        check_and_generate_routes,
        trigger=CronTrigger(minute="*"),   # executa todo minuto :00
        id="route_generator",
        replace_existing=True,
        misfire_grace_time=30,             # tolera até 30s de atraso
    )
    scheduler.start()
    print("[EcoTrack Scheduler] ✅ Scheduler iniciado — verificando turnos a cada minuto")


def stop_scheduler():
    """Encerra o scheduler. Chamado no shutdown do FastAPI."""
    if scheduler.running:
        scheduler.shutdown()
        print("[EcoTrack Scheduler] Scheduler encerrado")
