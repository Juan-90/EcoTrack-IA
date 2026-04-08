export type AppThemeName = "dark" | "light" | "eco";

export interface AppTheme {
  name: AppThemeName;
  label: string;
  colors: {
    bg: string;
    surface: string;
    card: string;
    border: string;
    accent: string;
    accentHover: string;
    text: string;
    textMuted: string;
    danger: string;
    warning: string;
    info: string;
    tabBarBackground: string;
    headerBackground: string;
    headerText: string;
  };
}

export const themes: Record<AppThemeName, AppTheme> = {
  dark: {
    name: "dark",
    label: "Verde Escuro",
    colors: {
      bg: "#08130D",
      surface: "#0d1f14",
      card: "#1b4332",
      border: "#2d6a4f",
      accent: "#4ade80",
      accentHover: "#86efac",
      text: "#ffffff",
      textMuted: "#9ca3af",
      danger: "#f87171",
      warning: "#facc15",
      info: "#60a5fa",
      tabBarBackground: "#0d1f14",
      headerBackground: "#0d1f14",
      headerText: "#ffffff",
    },
  },
  light: {
    name: "light",
    label: "Branco e Verde",
    colors: {
      bg: "#f0fdf4",
      surface: "#ffffff",
      card: "#ffffff",
      border: "#bbf7d0",
      accent: "#16a34a",
      accentHover: "#15803d",
      text: "#0f172a",
      textMuted: "#6b7280",
      danger: "#dc2626",
      warning: "#ca8a04",
      info: "#2563eb",
      tabBarBackground: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#0f172a",
    },
  },
  eco: {
    name: "eco",
    label: "Eco Suave",
    colors: {
      bg: "#ecfdf5",
      surface: "#d1fae5",
      card: "#ffffff",
      border: "#a7f3d0",
      accent: "#059669",
      accentHover: "#047857",
      text: "#064e3b",
      textMuted: "#6b7280",
      danger: "#dc2626",
      warning: "#b45309",
      info: "#1d4ed8",
      tabBarBackground: "#ecfdf5",
      headerBackground: "#d1fae5",
      headerText: "#064e3b",
    },
  },
};
