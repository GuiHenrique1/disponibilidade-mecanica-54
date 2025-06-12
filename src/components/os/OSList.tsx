
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { getStatusColor } from './OSFormUtils';

interface OSListProps {
  ordensServico: OrdemServico[];
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  onEdit: (os: OrdemServico) => void;
  onDelete: (id: string) => void;
}

export const OSList: React.FC<OSListProps> = ({
  ordensServico,
  cavalos,
  composicoes,
  onEdit,
  onDelete
}) => {
  const getVeiculoLabel = (veiculoId: string, tipoVeiculo: 'frota' | 'composicao') => {
    if (tipoVeiculo === 'frota') {
      const cavalo = cavalos.find(c => c.id === veiculoId);
      return cavalo ? cavalo.nomeFreota : 'Frota não encontrada';
    } else {
      const composicao = composicoes.find(c => c.id === veiculoId);
      return composicao ? composicao.identificador : 'Composição não encontrada';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordens de Serviço ({ordensServico.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ordensServico.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma ordem de serviço encontrada.
            </p>
          ) : (
            ordensServico.map((os) => (
              <div key={os.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-sm">OS #{os.id.slice(0, 8)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(os.status)}`}>
                        {os.status}
                      </span>
                      {os.isStandBy && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          STAND-BY
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Veículo: </span>
                        <span className="font-medium">
                          {getVeiculoLabel(os.veiculoId, os.tipoVeiculo)} ({os.tipoVeiculo})
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Placa(s): </span>
                        <span>{os.placaReferente}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Abertura: </span>
                        <span>{os.dataAbertura} {os.horaAbertura}</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Tipo: </span>
                      <span>{os.tipoManutencao}</span>
                    </div>

                    {os.dataFechamento && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Fechamento: </span>
                        <span>{os.dataFechamento} {os.horaFechamento}</span>
                      </div>
                    )}

                    {os.descricaoServico && (
                      <p className="text-sm text-muted-foreground">{os.descricaoServico}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
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
