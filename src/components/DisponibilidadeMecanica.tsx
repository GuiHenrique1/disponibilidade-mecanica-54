
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CavaloMecanico, Composicao, OrdemServico } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calcularDisponibilidade } from '@/utils/disponibilidadeCalculator';
import { DisponibilidadeChart } from './DisponibilidadeChart';
import { DisponibilidadeTable } from './DisponibilidadeTable';

export const DisponibilidadeMecanica: React.FC = () => {
  const [cavalos] = useLocalStorage<CavaloMecanico[]>('cavalos-mecanicos', []);
  const [composicoes] = useLocalStorage<Composicao[]>('composicoes', []);
  const [ordensServico] = useLocalStorage<OrdemServico[]>('ordens-servico', []);
  
  const [dataAnalise, setDataAnalise] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [metaCavalos, setMetaCavalos] = useState(90);
  const [metaComposicoes, setMetaComposicoes] = useState(90);

  // Converter data para formato DD-MM-AAAA
  const dataAnaliseFormatada = useMemo(() => {
    if (!dataAnalise) return '';
    const [year, month, day] = dataAnalise.split('-');
    return `${day}-${month}-${year}`;
  }, [dataAnalise]);

  // Calcular disponibilidade dos cavalos (frota)
  const dadosCavalos = useMemo(() => {
    return calcularDisponibilidade(
      cavalos.length,
      ordensServico,
      dataAnaliseFormatada,
      'frota'
    );
  }, [cavalos.length, ordensServico, dataAnaliseFormatada]);

  // Calcular disponibilidade das composições
  const dadosComposicoes = useMemo(() => {
    return calcularDisponibilidade(
      composicoes.length,
      ordensServico,
      dataAnaliseFormatada,
      'composicao'
    );
  }, [composicoes.length, ordensServico, dataAnaliseFormatada]);

  // Data e hora atual para exibição
  const dataHoraAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Disponibilidade Mecânica</h1>
        <div className="text-sm text-muted-foreground">
          {dataHoraAtual}
        </div>
      </div>

      <Tabs defaultValue="cavalos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cavalos">Cavalos Mecânicos</TabsTrigger>
          <TabsTrigger value="composicoes">Composições</TabsTrigger>
        </TabsList>

        <TabsContent value="cavalos" className="space-y-6">
          {/* Controles para Cavalos */}
          <Card>
            <CardHeader>
              <CardTitle>Controles de Análise - Cavalos Mecânicos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataAnalise">Data de Análise</Label>
                <Input
                  id="dataAnalise"
                  type="date"
                  value={dataAnalise}
                  onChange={(e) => setDataAnalise(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="metaCavalos">Meta de Disponibilidade (%)</Label>
                <Input
                  id="metaCavalos"
                  type="number"
                  min="0"
                  max="100"
                  value={metaCavalos}
                  onChange={(e) => setMetaCavalos(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo Cavalos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Total de Cavalos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosCavalos.totalFrota}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Disponibilidade Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosCavalos.mediaDisponibilidade.toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Veículos Disponíveis (Média)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosCavalos.mediaVeiculosDisponiveis.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Status da Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-center ${
                  dadosCavalos.mediaDisponibilidade >= metaCavalos ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dadosCavalos.mediaDisponibilidade >= metaCavalos ? 'ATINGIDA' : 'NÃO ATINGIDA'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos Cavalos */}
          <DisponibilidadeChart dados={dadosCavalos} metaDisponibilidade={metaCavalos} tipoVeiculo="cavalos" />

          {/* Tabela Cavalos */}
          <DisponibilidadeTable dados={dadosCavalos} />
        </TabsContent>

        <TabsContent value="composicoes" className="space-y-6">
          {/* Controles para Composições */}
          <Card>
            <CardHeader>
              <CardTitle>Controles de Análise - Composições</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataAnaliseComp">Data de Análise</Label>
                <Input
                  id="dataAnaliseComp"
                  type="date"
                  value={dataAnalise}
                  onChange={(e) => setDataAnalise(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="metaComposicoes">Meta de Disponibilidade (%)</Label>
                <Input
                  id="metaComposicoes"
                  type="number"
                  min="0"
                  max="100"
                  value={metaComposicoes}
                  onChange={(e) => setMetaComposicoes(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo Composições */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Total de Composições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosComposicoes.totalFrota}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Disponibilidade Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosComposicoes.mediaDisponibilidade.toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Composições Disponíveis (Média)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-center">{dadosComposicoes.mediaVeiculosDisponiveis.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Status da Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-center ${
                  dadosComposicoes.mediaDisponibilidade >= metaComposicoes ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dadosComposicoes.mediaDisponibilidade >= metaComposicoes ? 'ATINGIDA' : 'NÃO ATINGIDA'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos Composições */}
          <DisponibilidadeChart dados={dadosComposicoes} metaDisponibilidade={metaComposicoes} tipoVeiculo="composicoes" />

          {/* Tabela Composições */}
          <DisponibilidadeTable dados={dadosComposicoes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
