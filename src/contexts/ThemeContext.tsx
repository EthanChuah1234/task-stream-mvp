import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'default' | 'neon-code' | 'ocean-breeze' | 'retro-terminal' | 'solar-sunset' | 'minimal-zen';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { id: 'default' as Theme, name: 'Default Dark', description: 'Classic dark theme with purple accents' },
  { id: 'neon-code' as Theme, name: 'Neon Code', description: 'Dark background with glowing green/purple neon' },
  { id: 'ocean-breeze' as Theme, name: 'Ocean Breeze', description: 'Calming blues and aqua gradients' },
  { id: 'retro-terminal' as Theme, name: 'Retro Terminal', description: 'Old-school green-on-black hacker style' },
  { id: 'solar-sunset' as Theme, name: 'Solar Sunset', description: 'Warm oranges, reds, and purples' },
  { id: 'minimal-zen' as Theme, name: 'Minimal Zen', description: 'Soft pastels with clean white space' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}