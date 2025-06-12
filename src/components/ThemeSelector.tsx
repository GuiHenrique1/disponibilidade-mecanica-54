
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme, Theme } from '@/hooks/useTheme';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'jsl':
        return <Palette className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return 'Tema Claro';
      case 'dark':
        return 'Tema Escuro';
      case 'jsl':
        return 'Tema JSL';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-40 bg-background border border-border shadow-md hover:bg-accent">
          <div className="flex items-center gap-2">
            {getThemeIcon(theme)}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Tema Claro</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Tema Escuro</span>
            </div>
          </SelectItem>
          <SelectItem value="jsl">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Tema JSL</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
