import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'dark' | 'light';

export type ThemeColors = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentText: string;
  danger: string;
  card: string;
};

export const DARK_THEME: ThemeColors = {
  bg: '#121214',
  surface: '#1A1A1E',
  surface2: '#26262B',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  border: '#2A2A30',
  accent: '#FFD33D',
  accentText: '#121214',
  danger: '#EF4444',
  card: '#18181B',
};

export const LIGHT_THEME: ThemeColors = {
  bg: '#F4F4F6',
  surface: '#FFFFFF',
  surface2: '#EAECEF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#F59E0B',
  accentText: '#FFFFFF',
  danger: '#EF4444',
  card: '#FFFFFF',
};

type ThemeContextType = {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = '@stickersmash_app_theme';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: DARK_THEME,
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      } else if (systemScheme === 'light' || systemScheme === 'dark') {
        setThemeState(systemScheme);
      }
    });
  }, [systemScheme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
