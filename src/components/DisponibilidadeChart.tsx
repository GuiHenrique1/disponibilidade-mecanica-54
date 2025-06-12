
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DadosDisponibilidade } from '@/types';

interface DisponibilidadeChartProps {
  dados: DadosDisponibilidade;
  metaDisponibilidade: number;
}

export const DisponibilidadeChart: React.FC<DisponibilidadeChartProps> = ({ dados, metaDisponibilidade }) => {
  // Dados para o gráfico de rosca
  const pieData = [
    { 
      name: 'Real', 
      value: dados.mediaDisponibilidade,
      color: dados.mediaDisponibilidade >= metaDisponibilidade ? '#10b981' : '#ef4444'
    },
    { 
      name: 'Diferença', 
      value: 100 - dados.mediaDisponibilidade,
      color: '#e5e7eb'
    }
  ];

  // Dados para o gráfico de barras
  const barData = dados.disponibilidadePorHora.map(hora => ({
    hora: `${hora.hora}h`,
    disponiveis: hora.totalDisponiveis,
    meta: (metaDisponibilidade / 100) * dados.totalFrota,
    acimaMeta: hora.totalDisponiveis >= (metaDisponibilidade / 100) * dados.totalFrota
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Disponíveis: ${payload[0].value} veículos`}
          </p>
          <p className="text-sm text-gray-600">
            {`Meta: ${payload[0].payload.meta.toFixed(1)} veículos`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = ({ value }: any) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Rosca */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Disponibilidade Mecânica</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderPieLabel}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold">{dados.mediaDisponibilidade.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            Meta: {metaDisponibilidade}%
          </p>
          <p className="text-xs text-muted-foreground">
            {dados.mediaVeiculosDisponiveis.toFixed(1)} veículos em média
          </p>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Disponibilidade por Hora</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hora" 
              fontSize={12}
              interval={1}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={(metaDisponibilidade / 100) * dados.totalFrota} 
              stroke="#f59e0b" 
              strokeDasharray="5 5"
              label="Meta"
            />
            <Bar dataKey="disponiveis" radius={[4, 4, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.acimaMeta ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
