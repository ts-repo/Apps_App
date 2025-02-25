import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon, Gamepad2 } from 'lucide-react-native';
import { useThemeStore, Theme } from '../stores/themeStore';

interface ThemeToggleProps {
  size?: number;
}

export function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'gaming'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
    >
      {theme === 'light' && <Sun size={size} color="#000000" />}
      {theme === 'dark' && <Moon size={size} color="#FFFFFF" />}
      {theme === 'gaming' && <Gamepad2 size={size} color="#FF0000" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});