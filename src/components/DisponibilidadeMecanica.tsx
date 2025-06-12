
import React from 'react';
import { DisponibilidadeChart } from './DisponibilidadeChart';
import { DisponibilidadeTable } from './DisponibilidadeTable';
import { LogoUpload } from './LogoUpload';

export const DisponibilidadeMecanica = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Disponibilidade Mecânica</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DisponibilidadeChart />
          <DisponibilidadeTable />
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
