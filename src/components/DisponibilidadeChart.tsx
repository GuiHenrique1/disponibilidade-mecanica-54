
import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, LabelList
} from 'recharts';
import { DadosDisponibilidade } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface DisponibilidadeChartProps {
  dados: DadosDisponibilidade;
  metaDisponibilidade: number;
  tipoVeiculo: 'cavalos' | 'composicoes';
}

// Custom Label para valores acima das barras – sempre visível
const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  if (value === null || value === undefined) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#374151"
      textAnchor="middle"
      fontSize="13"
      fontWeight="bold"
      style={{ pointerEvents: 'none' }}
    >
      {value}
    </text>
  );
};

export const DisponibilidadeChart: React.FC<DisponibilidadeChartProps> = ({
  dados,
  metaDisponibilidade,
  tipoVeiculo,
}) => {
  const isMobile = useIsMobile();

  const pieData = [
    {
      name: 'Real',
      value: dados.mediaDisponibilidade,
      color: dados.mediaDisponibilidade >= metaDisponibilidade ? '#10b981' : '#ef4444',
    },
    {
      name: 'Diferença',
      value: 100 - dados.mediaDisponibilidade,
      color: '#e5e7eb',
    },
  ];

  const metaValue = Math.round((metaDisponibilidade / 100) * dados.totalFrota);

  const barData = Array.from({ length: 24 }, (_, index) => {
    const horaData = dados.disponibilidadePorHora.find(h => h.hora === index);
    const totalDisponiveis = horaData?.totalDisponiveis || 0;
    const totalParados = horaData?.totalIndisponiveis || 0;
    
    return {
      hora: `${index}h`,
      horaNumero: index,
      disponiveis: totalDisponiveis,
      parados: totalParados,
      meta: metaValue,
      acimaMeta: horaData?.totalDisponiveis !== null ? (horaData.totalDisponiveis >= metaValue) : false,
      isHoraFutura: horaData?.isHoraFutura || false,
      temDados: horaData?.totalDisponiveis !== null
    };
  });

  const tipoVeiculoTexto = tipoVeiculo === 'cavalos' ? 'Cavalos Mecânicos' : 'Composições';
  const tempoRealInfo = dados.isTempoReal ? (
    <span className="text-xs text-muted-foreground ml-2">
      (até {dados.horaAtual}h - tempo real)
    </span>
  ) : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Se for hora futura ou sem dados, mostrar tooltip diferente
      if (data.isHoraFutura || !data.temDados) {
        return (
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium">{`${label}`}</p>
            <p className="text-sm text-muted-foreground">
              Horário ainda não alcançado
            </p>
          </div>
        );
      }

      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Disponíveis: ${data.disponiveis} veículos`}
          </p>
          <p className="text-sm text-red-600">
            {`Parados: ${data.parados} veículos`}
          </p>
          <p className="text-sm text-gray-600">
            {`Meta: ${metaValue} veículos`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = ({ value }: any) => `${value.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Gráfico de Rosca */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Disponibilidade Mecânica</h3>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={45}
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
        <div className="text-center mt-2">
          <p className="text-2xl font-bold text-center">{dados.mediaDisponibilidade.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground text-center">
            Meta: {metaDisponibilidade}%
          </p>
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(dados.mediaVeiculosDisponiveis)} disponíveis
          </p>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Disponibilidade por Hora - {tipoVeiculoTexto}
          {tempoRealInfo}
        </h3>
        <ResponsiveContainer width="100%" height={isMobile ? 400 : 450}>
          <BarChart
            data={barData}
            margin={{ 
              top: isMobile ? 40 : 50, 
              right: isMobile ? 15 : 100, 
              left: isMobile ? 5 : 20, 
              bottom: isMobile ? 90 : 5 
            }}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="hora"
              fontSize={isMobile ? 9 : 12}
              interval={0}
              angle={isMobile ? -90 : -45}
              textAnchor="end"
              height={isMobile ? 90 : 60}
              tick={{ fontSize: isMobile ? 9 : 12 }}
            />
            <YAxis 
              fontSize={isMobile ? 9 : 12}
              tick={{ fontSize: isMobile ? 9 : 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="disponiveis" 
              radius={[4, 4, 0, 0]}
              maxBarSize={isMobile ? 20 : 40}
            >
              <LabelList dataKey="disponiveis" content={CustomLabel} />
              {barData.map((entry, index) => {
                // Colorir todas as barras, incluindo futuras (transparente para futuras)
                if (entry.isHoraFutura || !entry.temDados) {
                  return <Cell key={`cell-${index}`} fill="#e5e7eb" opacity={0.4} />;
                }
                return (
                  <Cell key={`cell-${index}`} fill={entry.acimaMeta ? '#10b981' : '#ef4444'} />
                );
              })}
            </Bar>
            <ReferenceLine
              y={metaValue}
              stroke="#ef4444"
              strokeWidth={isMobile ? 2 : 3}
              strokeDasharray="none"
              label={{
                value: `Meta: ${metaValue}`,
                position: isMobile ? "top" : "right",
                fill: "#ef4444",
                fontSize: isMobile ? 9 : 12,
                fontWeight: "bold",
                offset: isMobile ? 5 : 10
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
