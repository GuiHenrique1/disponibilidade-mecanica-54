
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'jsl';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'jsl');
    
    // Add the current theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'jsl') {
      document.documentElement.classList.add('jsl');
    }
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, setTheme: setThemeValue };
};
