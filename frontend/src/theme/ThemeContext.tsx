import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppThemeName, themes } from "@/src/theme/palettes";

const THEME_STORAGE_KEY = "@ecotrack:theme";

interface ThemeContextData {
  themeName: AppThemeName;
  theme: (typeof themes)[AppThemeName];
  setThemeName: (themeName: AppThemeName) => Promise<void>;
  isThemeLoading: boolean;
}

const ThemeContext = createContext({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<AppThemeName>("dark");
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (
          storedTheme === "dark" ||
          storedTheme === "light" ||
          storedTheme === "eco"
        ) {
          setThemeNameState(storedTheme);
        }
      } finally {
        setIsThemeLoading(false);
      }
    }

    loadTheme();
  }, []);

  async function setThemeName(nextTheme: AppThemeName) {
    setThemeNameState(nextTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: themes[themeName],
        setThemeName,
        isThemeLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
