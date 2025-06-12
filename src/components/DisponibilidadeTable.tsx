
import React from 'react';
import { DadosDisponibilidade } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DisponibilidadeTableProps {
  dados: DadosDisponibilidade;
}

export const DisponibilidadeTable: React.FC<DisponibilidadeTableProps> = ({ dados }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabela de Disponibilidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Métrica</th>
                {Array.from({ length: 24 }, (_, i) => (
                  <th key={i} className="text-center p-1 font-medium min-w-[60px]">
                    {i}h
                  </th>
                ))}
                <th className="text-center p-2 font-medium bg-accent">MÉDIA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">Total de veículos disponíveis</td>
                {dados.disponibilidadePorHora.map((hora, index) => (
                  <td key={index} className="text-center p-1">
                    {hora.totalDisponiveis}
                  </td>
                ))}
                <td className="text-center p-2 bg-accent font-medium">
                  {dados.mediaVeiculosDisponiveis.toFixed(1)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">Disponibilidade mecânica %</td>
                {dados.disponibilidadePorHora.map((hora, index) => (
                  <td key={index} className="text-center p-1">
                    {hora.percentualDisponibilidade.toFixed(1)}%
                  </td>
                ))}
                <td className="text-center p-2 bg-accent font-medium">
                  {dados.mediaDisponibilidade.toFixed(1)}%
                </td>
              </tr>
              <tr className="border-b bg-primary/5">
                <td className="p-2 font-medium">TOTAL (Frota)</td>
                {Array.from({ length: 24 }, (_, i) => (
                  <td key={i} className="text-center p-1 font-medium">
                    {dados.totalFrota}
                  </td>
                ))}
                <td className="text-center p-2 bg-accent font-medium">
                  {dados.totalFrota}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Total de frotas indisponíveis</td>
                {dados.disponibilidadePorHora.map((hora, index) => (
                  <td key={index} className="text-center p-1">
                    {hora.totalIndisponiveis}
                  </td>
                ))}
                <td className="text-center p-2 bg-accent font-medium">
                  {(dados.totalFrota - dados.mediaVeiculosDisponiveis).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
