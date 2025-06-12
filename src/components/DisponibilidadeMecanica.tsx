
import React from 'react';
import { DisponibilidadeChart } from './DisponibilidadeChart';
import { DisponibilidadeTable } from './DisponibilidadeTable';
import { LogoUpload } from './LogoUpload';
import { DadosDisponibilidade } from '@/types';

export const DisponibilidadeMecanica = () => {
  // Mock data for the components
  const mockDados: DadosDisponibilidade = {
    totalFrota: 50,
    mediaDisponibilidade: 85.5,
    mediaVeiculosDisponiveis: 42.8,
    disponibilidadePorHora: Array.from({ length: 24 }, (_, i) => ({
      hora: i,
      totalDisponiveis: Math.floor(Math.random() * 10) + 40,
      totalIndisponiveis: Math.floor(Math.random() * 10) + 5,
      percentualDisponibilidade: Math.floor(Math.random() * 20) + 75
    }))
  };

  const metaDisponibilidade = 80;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Disponibilidade Mecânica</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DisponibilidadeChart dados={mockDados} metaDisponibilidade={metaDisponibilidade} />
          <DisponibilidadeTable dados={mockDados} />
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Configurações</h2>
            <LogoUpload />
          </div>
        </div>
      </div>
    </div>
  );
};
