
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DadosDisponibilidade } from '@/types';

interface DisponibilidadeChartProps {
  dados: DadosDisponibilidade;
  metaDisponibilidade: number;
}

export const DisponibilidadeChart: React.FC<DisponibilidadeChartProps> = ({ dados, metaDisponibilidade }) => {
  // Cores refinadas para o design moderno
  const colors = {
    success: '#00D084', // Verde vibrante
    danger: '#CF2E2E',  // Vermelho impactante
    neutral: '#E0E0E0', // Cinza muito claro
    metaLine: '#ABB8C3' // Cinza médio para linha da meta
  };

  // Determinar se a meta foi atingida
  const metaAtingida = dados.mediaDisponibilidade >= metaDisponibilidade;

  // Dados para o gráfico de rosca
  const pieData = [
    { 
      name: 'Real', 
      value: dados.mediaDisponibilidade,
      color: metaAtingida ? colors.success : colors.danger
    },
    { 
      name: 'Restante', 
      value: 100 - dados.mediaDisponibilidade,
      color: colors.neutral
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
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-800 mb-1">{`${label}`}</p>
          <p className="text-sm text-gray-600">
            {`Disponíveis: ${payload[0].value} veículos`}
          </p>
          <p className="text-sm text-gray-500">
            {`Meta: ${payload[0].payload.meta.toFixed(1)} veículos`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = ({ value }: any) => {
    // Só mostrar label para valores significativos (> 5%)
    return value > 5 ? `${value.toFixed(1)}%` : '';
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            {`${payload[0].payload.name}: ${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Gráfico de Rosca */}
      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Disponibilidade Mecânica</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderPieLabel}
              className="text-sm font-medium"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {dados.mediaDisponibilidade.toFixed(1)}%
          </div>
          <div className="space-y-1">
            <p className="text-base text-gray-600 font-medium">
              Meta: {metaDisponibilidade}%
            </p>
            <p className="text-sm text-gray-500">
              {dados.mediaVeiculosDisponiveis.toFixed(1)} veículos em média
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
              metaAtingida 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {metaAtingida ? '✓ Meta Atingida' : '✗ Abaixo da Meta'}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Disponibilidade por Hora</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart 
            data={barData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="15%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#EBEBEB" 
              strokeWidth={1}
              vertical={false}
            />
            <XAxis 
              dataKey="hora" 
              fontSize={12}
              interval={1}
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            <YAxis 
              fontSize={12}
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={(metaDisponibilidade / 100) * dados.totalFrota} 
              stroke={colors.metaLine}
              strokeDasharray="8 4"
              strokeWidth={2}
              label={{
                value: `Meta: ${((metaDisponibilidade / 100) * dados.totalFrota).toFixed(1)}`,
                position: "topRight",
                fontSize: 12,
                fill: "#6B7280",
                fontWeight: "500"
              }}
            />
            <Bar 
              dataKey="disponiveis" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {barData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.acimaMeta ? colors.success : colors.danger}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Legenda personalizada */}
        <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.success }}></div>
            <span className="text-sm text-gray-600 font-medium">Acima/Na Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.danger }}></div>
            <span className="text-sm text-gray-600 font-medium">Abaixo da Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5" style={{ backgroundColor: colors.metaLine }}></div>
            <span className="text-sm text-gray-600 font-medium">Linha da Meta</span>
          </div>
        </div>
      </div>
    </div>
  );
};
