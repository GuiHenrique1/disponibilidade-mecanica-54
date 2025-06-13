
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { DadosDisponibilidade } from '@/types';

interface DisponibilidadeChartProps {
  dados: DadosDisponibilidade;
  metaDisponibilidade: number;
  tipoVeiculo: 'cavalos' | 'composicoes';
}

export const DisponibilidadeChart: React.FC<DisponibilidadeChartProps> = ({ dados, metaDisponibilidade, tipoVeiculo }) => {
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

  const metaValue = Math.round((metaDisponibilidade / 100) * dados.totalFrota);

  // Dados para o gráfico de barras - sempre 24 horas
  const barData = Array.from({ length: 24 }, (_, index) => {
    const horaData = dados.disponibilidadePorHora.find(h => h.hora === index);
    return {
      hora: `${index}h`,
      horaNumero: index,
      disponiveis: horaData?.totalDisponiveis || 0, // 0 for future hours
      meta: metaValue,
      acimaMeta: horaData?.totalDisponiveis !== null ? (horaData.totalDisponiveis >= metaValue) : false,
      isHoraFutura: horaData?.isHoraFutura || false,
      temDados: horaData?.totalDisponiveis !== null // Flag to check if we have real data
    };
  });

  const CustomTooltip = ({ active, payload, label, ...props }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Se for hora futura ou sem dados, mostrar tooltip diferente
      if (data.isHoraFutura || !data.temDados) {
        return (
          <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
            <p className="text-sm font-medium">{`${label}`}</p>
            <p className="text-sm text-muted-foreground">
              Horário ainda não alcançado
            </p>
          </div>
        );
      }

      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Disponíveis: ${Math.round(payload[0].value)} veículos`}
          </p>
          <p className="text-sm text-gray-600">
            {`Meta: ${metaValue} veículos`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = ({ value }: any) => {
    return `${value.toFixed(1)}%`;
  };

  // Função para renderizar valores acima das barras apenas para horas passadas
  const renderBarLabel = (props: any) => {
    const { x, y, width, value, payload } = props;
    
    // Só mostrar se payload existe e tem dados reais (não é hora futura)
    if (!payload || payload.isHoraFutura || !payload.temDados) {
      return null;
    }
    
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="12"
        fontWeight="500"
      >
        {payload.disponiveis}
      </text>
    );
  };

  const tipoVeiculoTexto = tipoVeiculo === 'cavalos' ? 'Cavalos Mecânicos' : 'Composições';

  // Informação sobre tempo real
  const tempoRealInfo = dados.isTempoReal ? (
    <span className="text-xs text-muted-foreground ml-2">
      (até {dados.horaAtual}h - tempo real)
    </span>
  ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Gráfico de Rosca - Menor */}
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
            {Math.round(dados.mediaVeiculosDisponiveis)} veículos em média
          </p>
        </div>
      </div>

      {/* Gráfico de Barras - Maior (3 colunas) */}
      <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Disponibilidade por Hora - {tipoVeiculoTexto}
          {tempoRealInfo}
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={barData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hora" 
              fontSize={12}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="disponiveis" radius={[4, 4, 0, 0]} style={{ zIndex: 2 }}>
              <LabelList content={renderBarLabel} />
              {barData.map((entry, index) => {
                // Só colorir barras que têm dados (não futuras)
                if (entry.isHoraFutura || !entry.temDados) {
                  return <Cell key={`cell-${index}`} fill="transparent" />;
                }
                return (
                  <Cell key={`cell-${index}`} fill={entry.acimaMeta ? '#10b981' : '#ef4444'} />
                );
              })}
            </Bar>
            <ReferenceLine 
              y={metaValue} 
              stroke="#ef4444" 
              strokeWidth={4}
              strokeDasharray="none"
              style={{ zIndex: 10 }}
              label={{ 
                value: `Meta: ${metaValue}`, 
                position: "right",
                fill: "#ef4444",
                fontSize: 12,
                fontWeight: "bold"
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
