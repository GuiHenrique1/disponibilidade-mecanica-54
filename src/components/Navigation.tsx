
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogoDisplay } from '@/components/LogoDisplay';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'cavalos', label: 'Cavalos Mecânicos' },
  { id: 'composicoes', label: 'Composições' },
  { id: 'motoristas', label: 'Motoristas' },
  { id: 'os', label: 'Ordens de Serviço' },
  { id: 'disponibilidade', label: 'Disponibilidade Mecânica' }
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <LogoDisplay />
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
