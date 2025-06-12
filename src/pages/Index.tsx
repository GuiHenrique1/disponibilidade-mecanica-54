
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CavalosMecanicos } from '@/components/CavalosMecanicos';
import { Composicoes } from '@/components/Composicoes';
import { Motoristas } from '@/components/Motoristas';
import { OrdensServico } from '@/components/OrdensServico';
import { DisponibilidadeMecanica } from '@/components/DisponibilidadeMecanica';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppProvider } from '@/contexts/AppContext';

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState('cavalos');

  const renderContent = () => {
    switch (activeTab) {
      case 'cavalos':
        return <CavalosMecanicos />;
      case 'composicoes':
        return <Composicoes />;
      case 'motoristas':
        return <Motoristas />;
      case 'os':
        return <OrdensServico />;
      case 'disponibilidade':
        return <DisponibilidadeMecanica />;
      default:
        return <CavalosMecanicos />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ThemeToggle />
      <main className="container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

export default Index;
