// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — pages/Shifts/index.tsx
//  Gerenciamento de turnos de coleta — painel do gestor
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Clock, Trash2, Play, ToggleLeft, ToggleRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, LoadingSpinner } from '../../components/ui';
import api from '../../services/api';

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

interface Shift {
  id: number;
  name: string;
  scheduled_time: string;
  end_time: string;
  active_days: number[];
  active_days_label: string[];
  min_fill_level: number;
  is_active: boolean;
}

const defaultForm = {
  name: '',
  scheduled_time: '06:00',
  end_time: '13:00',
  active_days: [0, 1, 2, 3, 4],
  min_fill_level: 50,
};

export default function Shifts() {
  const qc = useQueryClient();
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(defaultForm);
  const [feedback, setFeedback]   = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const { data: shifts, isLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn:  () => api.get<Shift[]>('/shifts/').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof defaultForm) => api.post('/shifts/', data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['shifts'] }); setShowForm(false); setForm(defaultForm); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.patch(`/shifts/${id}`, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shifts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/shifts/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['shifts'] }),
  });

  const generateMutation = useMutation({
    mutationFn: (id: number) => api.post(`/shifts/${id}/generate`).then(r => r.data),
    onSuccess:  (data) => {
      qc.invalidateQueries({ queryKey: ['routes'] });
      setFeedback({ type: 'ok', msg: data.message });
      setTimeout(() => setFeedback(null), 4000);
    },
    onError: (err: any) => {
      setFeedback({ type: 'err', msg: err.response?.data?.detail ?? 'Erro ao gerar rotas' });
      setTimeout(() => setFeedback(null), 5000);
    },
  });

  const toggleDay = (day: number) =>
    setForm(f => ({
      ...f,
      active_days: f.active_days.includes(day)
        ? f.active_days.filter(d => d !== day)
        : [...f.active_days, day].sort(),
    }));

  if (isLoading) return <LoadingSpinner message="Carregando turnos..." />;

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Feedback */}
      {feedback && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={
          feedback.type === 'ok'
            ? { background: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.2)' }
            : { background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)' }
        }>
          {feedback.type === 'ok'
            ? <CheckCircle  className="w-4 h-4 text-green-400 flex-shrink-0" />
            : <AlertCircle  className="w-4 h-4 text-red-400   flex-shrink-0" />}
          <p className="text-sm" style={{ color: feedback.type === 'ok' ? '#86efac' : '#fca5a5' }}>
            {feedback.msg}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono mt-1" style={{ color: '#9ca3af' }}>
            Turnos são gerados automaticamente no horário configurado.
            O scheduler verifica a cada minuto.
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: '#4ade80', color: '#08130D' }}
        >
          <Plus className="w-4 h-4" />
          Novo Turno
        </button>
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <Card title="Novo Turno de Coleta">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono mb-1" style={{ color: '#9ca3af' }}>NOME DO TURNO</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Turno Manhã"
                className="w-full rounded-lg px-3 py-2 text-sm text-white border focus:outline-none"
                style={{ background: '#1b4332', borderColor: '#2d6a4f' }}
              />
            </div>

            {/* Hora início */}
            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: '#9ca3af' }}>GERAR ROTAS ÀS</label>
              <input
                type="time"
                value={form.scheduled_time}
                onChange={e => setForm(f => ({ ...f, scheduled_time: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-white border focus:outline-none"
                style={{ background: '#1b4332', borderColor: '#2d6a4f', colorScheme: 'dark' }}
              />
              <p className="text-[10px] mt-1" style={{ color: '#9ca3af' }}>
                Horário em que o sistema gera as rotas automaticamente
              </p>
            </div>

            {/* Hora fim */}
            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: '#9ca3af' }}>FIM DO TURNO</label>
              <input
                type="time"
                value={form.end_time}
                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-white border focus:outline-none"
                style={{ background: '#1b4332', borderColor: '#2d6a4f', colorScheme: 'dark' }}
              />
            </div>

            {/* Nível mínimo */}
            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: '#9ca3af' }}>
                NÍVEL MÍNIMO PARA COLETA: <span style={{ color: '#4ade80' }}>{form.min_fill_level}%</span>
              </label>
              <input
                type="range" min={0} max={100} step={5}
                value={form.min_fill_level}
                onChange={e => setForm(f => ({ ...f, min_fill_level: Number(e.target.value) }))}
                className="w-full accent-green-400"
              />
              <div className="flex justify-between text-[10px]" style={{ color: '#9ca3af' }}>
                <span>0% — todas</span>
                <span>100% — só cheias</span>
              </div>
            </div>

            {/* Dias da semana */}
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#9ca3af' }}>DIAS ATIVOS</label>
              <div className="flex gap-1.5 flex-wrap">
                {DIAS.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className="w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all border"
                    style={form.active_days.includes(i)
                      ? { background: 'rgba(74,222,128,0.2)', color: '#4ade80', borderColor: '#4ade80' }
                      : { background: '#1b4332', color: '#9ca3af', borderColor: '#2d6a4f' }
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.name || form.active_days.length === 0 || createMutation.isPending}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: '#4ade80', color: '#08130D' }}
            >
              {createMutation.isPending ? 'Salvando...' : 'Criar Turno'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg text-sm border transition-all"
              style={{ borderColor: '#2d6a4f', color: '#9ca3af' }}
            >
              Cancelar
            </button>
          </div>
        </Card>
      )}

      {/* Lista de turnos */}
      <div className="space-y-3">
        {shifts?.map(shift => (
          <div
            key={shift.id}
            className="rounded-xl border p-5"
            style={{
              background: '#0d1f14',
              borderColor: shift.is_active ? '#2d6a4f' : 'rgba(45,106,79,0.3)',
              opacity: shift.is_active ? 1 : 0.6,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Info principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-bold text-white">{shift.name}</h3>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                    style={shift.is_active
                      ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
                      : { background: 'rgba(156,163,175,0.15)', color: '#9ca3af' }
                    }
                  >
                    {shift.is_active ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>

                {/* Horários */}
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-sm font-mono text-white">
                      {shift.scheduled_time} — {shift.end_time}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    Lixeiras ≥ {shift.min_fill_level}%
                  </span>
                </div>

                {/* Dias */}
                <div className="flex gap-1.5 flex-wrap">
                  {DIAS.map((d, i) => (
                    <span
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold border"
                      style={shift.active_days.includes(i)
                        ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }
                        : { background: 'transparent', color: '#374151', borderColor: '#1f2937' }
                      }
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-2">
                {/* Gerar manualmente */}
                <button
                  onClick={() => generateMutation.mutate(shift.id)}
                  disabled={generateMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all"
                  style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}
                  title="Gerar rotas agora manualmente"
                >
                  <Play className="w-3 h-3" />
                  Gerar agora
                </button>

                {/* Ativar/Desativar */}
                <button
                  onClick={() => toggleMutation.mutate({ id: shift.id, is_active: !shift.is_active })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                  style={{ borderColor: '#2d6a4f', color: '#9ca3af' }}
                >
                  {shift.is_active
                    ? <ToggleRight className="w-3.5 h-3.5 text-green-400" />
                    : <ToggleLeft  className="w-3.5 h-3.5" />}
                  {shift.is_active ? 'Desativar' : 'Ativar'}
                </button>

                {/* Excluir */}
                <button
                  onClick={() => { if (confirm(`Excluir turno "${shift.name}"?`)) deleteMutation.mutate(shift.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                  style={{ borderColor: 'rgba(248,113,113,0.2)', color: '#f87171' }}
                >
                  <Trash2 className="w-3 h-3" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}

        {shifts?.length === 0 && (
          <div className="text-center py-16 rounded-xl border" style={{ borderColor: '#2d6a4f', borderStyle: 'dashed' }}>
            <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: '#2d6a4f' }} />
            <p className="text-sm text-white mb-1">Nenhum turno configurado</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Crie um turno para que o sistema gere rotas automaticamente
            </p>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d1f14', borderColor: '#2d6a4f' }}>
        <p className="text-xs font-mono font-bold text-white mb-2">ℹ️  Como funciona</p>
        <div className="space-y-1 text-xs" style={{ color: '#9ca3af' }}>
          <p>• O scheduler verifica a cada minuto se algum turno ativo deve gerar rotas</p>
          <p>• Ao gerar, o sistema tira um <strong className="text-white">snapshot</strong> dos níveis atuais das lixeiras</p>
          <p>• As paradas são ordenadas por <strong className="text-white">proximidade geográfica</strong> (algoritmo Nearest Neighbor)</p>
          <p>• As rotas são <strong className="text-white">travadas</strong> — leituras do sensor não alteram o percurso em andamento</p>
          <p>• Só lixeiras com nível acima do mínimo configurado são incluídas</p>
        </div>
      </div>
    </div>
  );
}
