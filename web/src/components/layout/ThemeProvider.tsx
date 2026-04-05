// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — ThemeProvider
//  Aplica data-theme no <html> — suporta dark | light | eco
// ─────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}