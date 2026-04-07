// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — useAlerts Hook
//  Gerencia alertas com som, contador e auto-resolução
// ─────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_ALERTS, DEFAULT_ALERT_SETTINGS } from '../services/mockData';
import type { Alert, AlertSettings, AlertStatus, AlertSeverity } from '../types';

const SEVERITY_ORDER: AlertSeverity[] = ['baixa', 'media', 'alta', 'critica'];

function playBeep(severity: AlertSeverity) {
  try {
    const ctx  = new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // frequência e duração variam por severidade
    const config = {
      critica: { freq: 880, duration: 0.6, pulses: 3 },
      alta:    { freq: 660, duration: 0.4, pulses: 2 },
      media:   { freq: 440, duration: 0.3, pulses: 1 },
      baixa:   { freq: 330, duration: 0.2, pulses: 1 },
    };
    const { freq, duration, pulses } = config[severity];

    osc.type      = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration * pulses);
  } catch { /* AudioContext bloqueado pelo browser — silencioso */ }
}

export function useAlerts() {
  const [alerts,   setAlerts]   = useState<Alert[]>(MOCK_ALERTS);
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_ALERT_SETTINGS);
  const prevActiveCount         = useRef(alerts.filter(a => a.status === 'ativa').length);

  // Detecta novos alertas e toca som se configurado
  useEffect(() => {
    const activeCount = alerts.filter(a => a.status === 'ativa').length;
    if (activeCount > prevActiveCount.current && settings.sound_enabled) {
      const newest = alerts
        .filter(a => a.status === 'ativa')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      if (newest) playBeep(newest.severity);
    }
    prevActiveCount.current = activeCount;
  }, [alerts, settings.sound_enabled]);

  // Filtra por severidade mínima configurada
  const filteredAlerts = alerts.filter(a => {
    const minIdx = SEVERITY_ORDER.indexOf(settings.min_severity);
    const curIdx = SEVERITY_ORDER.indexOf(a.severity);
    return curIdx >= minIdx;
  });

  const activeCount = filteredAlerts.filter(a => a.status === 'ativa').length;

  // Resolução manual
  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: 'resolvida' as AlertStatus, resolved_at: new Date().toISOString() }
        : a
    ));
  }, []);

  // Ignorar alerta
  const ignoreAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'ignorada' as AlertStatus } : a
    ));
  }, []);

  // Auto-resolução quando nível de lixeira baixar (chamado externamente)
  const autoResolveByBin = useCallback((binId: number) => {
    setAlerts(prev => prev.map(a =>
      a.entity_id === binId && a.auto_resolve && a.status === 'ativa'
        ? { ...a, status: 'resolvida' as AlertStatus, resolved_at: new Date().toISOString() }
        : a
    ));
  }, []);

  const updateSettings = useCallback((patch: Partial<AlertSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  return {
    alerts: filteredAlerts,
    activeCount,
    settings,
    resolveAlert,
    ignoreAlert,
    autoResolveByBin,
    updateSettings,
  };
}