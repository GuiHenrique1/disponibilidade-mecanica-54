
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrdemServico, CavaloMecanico, Composicao, Motorista } from '@/types';
import { Edit, Trash2, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { getStatusColor } from './OSFormUtils';
import { useOSFilters } from '@/hooks/useOSFilters';

interface OSListProps {
  ordensServico: OrdemServico[];
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  motoristas: Motorista[];
  onEdit: (os: OrdemServico) => void;
  onDelete: (id: string) => void;
  onFinalize: (os: OrdemServico) => void;
  onRefresh: () => void;
}

export const OSList: React.FC<OSListProps> = ({
  ordensServico,
  cavalos,
  composicoes,
  motoristas,
  onEdit,
  onDelete,
  onFinalize,
  onRefresh
}) => {
  const {
    filteredAndSortedOS,
    openOrdersCount,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    tipoFilter,
    setTipoFilter,
    veiculoFilter,
    setVeiculoFilter
  } = useOSFilters(ordensServico, cavalos, composicoes);

  const getVeiculoLabel = (veiculoId: string, tipoVeiculo: 'frota' | 'composicao') => {
    if (tipoVeiculo === 'frota') {
      const cavalo = cavalos.find(c => c.id === veiculoId);
      return cavalo ? cavalo.nomeFreota : 'Frota não encontrada';
    } else {
      const composicao = composicoes.find(c => c.id === veiculoId);
      return composicao ? composicao.identificador : 'Composição não encontrada';
    }
  };

  const getMotorista = (motoristaId?: string) => {
    if (!motoristaId) return 'Não informado';
    const motorista = motoristas.find(m => m.id === motoristaId);
    return motorista ? motorista.nome : 'Não encontrado';
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return date;
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };

  // Obter tipos únicos de manutenção
  const tiposManutencao = Array.from(new Set(ordensServico.map(os => os.tipoManutencao)));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Ordens de Serviço Abertas ({openOrdersCount})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
        
        {/* Filtros e Pesquisa */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de Pesquisa */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar por ID, descrição, placa, tipo, motorista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Aberta">Aberta</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Manutenção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {tiposManutencao.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={veiculoFilter} onValueChange={setVeiculoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Veículos</SelectItem>
                  <SelectItem value="frota">Frota</SelectItem>
                  <SelectItem value="composicao">Composição</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground flex items-center">
              Mostrando {filteredAndSortedOS.length} de {ordensServico.length} OSs
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredAndSortedOS.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {ordensServico.length === 0 ? 'Nenhuma ordem de serviço encontrada.' : 'Nenhuma OS encontrada com os filtros aplicados.'}
            </p>
          ) : (
            filteredAndSortedOS.map((os) => (
              <div key={os.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    {/* Primeira linha: Informações do veículo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-sm">OS #{os.id.slice(0, 8)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(os.status)}`}>
                          {os.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Informações do veículo, tipo, placas e motorista */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Veículo: </span>
                        <span className="font-medium">
                          {getVeiculoLabel(os.veiculoId, os.tipoVeiculo)} ({os.tipoVeiculo})
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tipo: </span>
                        <span>{os.tipoManutencao}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Placa(s): </span>
                        <span>{os.placaReferente}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Motorista: </span>
                        <span>{getMotorista(os.motoristaId)}</span>
                      </div>
                    </div>

                    {/* Segunda linha: Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Abertura: </span>
                        <span>{formatDate(os.dataAbertura)} {formatTime(os.horaAbertura)}</span>
                      </div>
                      {os.dataFechamento && (
                        <div>
                          <span className="text-muted-foreground">Fechamento: </span>
                          <span>{formatDate(os.dataFechamento)} {formatTime(os.horaFechamento)}</span>
                        </div>
                      )}
                      {os.previsaoLiberacao && (
                        <div>
                          <span className="text-muted-foreground">Previsão: </span>
                          <span>{formatDate(os.previsaoLiberacao)} {formatTime(os.horaPrevisaoLiberacao)}</span>
                        </div>
                      )}
                    </div>

                    {os.descricaoServico && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{os.descricaoServico}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {os.status === 'Aberta' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFinalize(os)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Finalizar OS"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(os)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(os.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
