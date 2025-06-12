
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '@/services/dataService';

export const OrdensServico: React.FC = () => {
  const [ordensServico, setOrdensServico] = useLocalStorage<OrdemServico[]>('ordens-servico', []);
  const [cavalos] = useLocalStorage<CavaloMecanico[]>('cavalos-mecanicos', []);
  const [composicoes] = useLocalStorage<Composicao[]>('composicoes', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tipoVeiculo: '' as 'frota' | 'composicao' | '',
    veiculoId: '',
    composicaoId: '',
    placaReferente: '',
    dataAbertura: '',
    horaAbertura: '',
    dataFechamento: '',
    horaFechamento: '',
    tipoManutencao: '' as OrdemServico['tipoManutencao'] | '',
    descricaoServico: '',
    status: '' as OrdemServico['status'] | '',
    criarStandBy: false
  });

  const resetForm = () => {
    setFormData({
      tipoVeiculo: '',
      veiculoId: '',
      composicaoId: '',
      placaReferente: '',
      dataAbertura: '',
      horaAbertura: '',
      dataFechamento: '',
      horaFechamento: '',
      tipoManutencao: '',
      descricaoServico: '',
      status: '',
      criarStandBy: false
    });
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const getVeiculoLabel = (veiculoId: string, tipoVeiculo: 'frota' | 'composicao') => {
    if (tipoVeiculo === 'frota') {
      const cavalo = cavalos.find(c => c.id === veiculoId);
      return cavalo ? cavalo.nomeFreota : 'Frota não encontrada';
    } else {
      const composicao = composicoes.find(c => c.id === veiculoId);
      return composicao ? composicao.identificador : 'Composição não encontrada';
    }
  };

  const handleTipoVeiculoChange = (tipo: 'frota' | 'composicao') => {
    setFormData({
      ...formData,
      tipoVeiculo: tipo,
      veiculoId: '',
      composicaoId: '',
      placaReferente: '',
      criarStandBy: false
    });
  };

  const handleVeiculoChange = (veiculoId: string) => {
    const cavalo = cavalos.find(c => c.id === veiculoId);
    setFormData({
      ...formData,
      veiculoId,
      placaReferente: cavalo ? cavalo.placa : ''
    });
  };

  const handleComposicaoChange = (composicaoId: string) => {
    const composicao = composicoes.find(c => c.id === composicaoId);
    setFormData({
      ...formData,
      composicaoId,
      placaReferente: composicao ? composicao.placas.join(', ') : ''
    });
  };

  const handleSubmit = () => {
    // Validações
    const selectedVehicleId = formData.tipoVeiculo === 'frota' ? formData.veiculoId : formData.composicaoId;
    
    if (!formData.tipoVeiculo || !selectedVehicleId || !formData.dataAbertura || 
        !formData.horaAbertura || !formData.tipoManutencao || !formData.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const osData: Omit<OrdemServico, 'id' | 'createdAt'> = {
      tipoVeiculo: formData.tipoVeiculo,
      veiculoId: selectedVehicleId,
      placaReferente: formData.placaReferente,
      dataAbertura: formatDateForStorage(formData.dataAbertura),
      horaAbertura: formData.horaAbertura,
      dataFechamento: formData.dataFechamento ? formatDateForStorage(formData.dataFechamento) : undefined,
      horaFechamento: formData.horaFechamento || undefined,
      tipoManutencao: formData.tipoManutencao,
      descricaoServico: formData.descricaoServico,
      status: formData.status
    };

    try {
      if (editingOS) {
        dataService.updateOrdemServico(editingOS.id, osData);
        setOrdensServico(dataService.getOrdensServico());
        toast({
          title: "Sucesso",
          description: "Ordem de serviço atualizada com sucesso."
        });
      } else {
        const novaOS = dataService.addOrdemServico(osData);
        
        // Criar OS Stand-by se solicitado
        if (formData.criarStandBy && formData.tipoVeiculo === 'composicao' && formData.veiculoId) {
          const cavaloStandBy = cavalos.find(c => c.id === formData.veiculoId);
          const composicao = composicoes.find(c => c.id === formData.composicaoId);
          
          if (cavaloStandBy && composicao) {
            const osStandBy: Omit<OrdemServico, 'id' | 'createdAt'> = {
              tipoVeiculo: 'frota',
              veiculoId: cavaloStandBy.id,
              placaReferente: cavaloStandBy.placa,
              dataAbertura: formatDateForStorage(formData.dataAbertura),
              horaAbertura: formData.horaAbertura,
              dataFechamento: formData.dataFechamento ? formatDateForStorage(formData.dataFechamento) : undefined,
              horaFechamento: formData.horaFechamento || undefined,
              tipoManutencao: formData.tipoManutencao,
              descricaoServico: `STAND-BY ${composicao.identificador} - ${formData.descricaoServico}`,
              status: formData.status,
              isStandBy: true,
              composicaoOrigemId: formData.composicaoId
            };
            
            dataService.addOrdemServico(osStandBy);
            toast({
              title: "Sucesso",
              description: "Ordem de serviço da composição e OS Stand-by do veículo criadas com sucesso."
            });
          } else {
            toast({
              title: "Aviso",
              description: "OS da composição criada, mas não foi possível criar a OS Stand-by do veículo."
            });
          }
        } else {
          toast({
            title: "Sucesso",
            description: "Ordem de serviço criada com sucesso."
          });
        }
        
        setOrdensServico(dataService.getOrdensServico());
      }

      resetForm();
      setEditingOS(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar ordem de serviço.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (os: OrdemServico) => {
    setEditingOS(os);
    setFormData({
      tipoVeiculo: os.tipoVeiculo,
      veiculoId: os.tipoVeiculo === 'frota' ? os.veiculoId : '',
      composicaoId: os.tipoVeiculo === 'composicao' ? os.veiculoId : '',
      placaReferente: os.placaReferente,
      dataAbertura: formatDateForInput(os.dataAbertura),
      horaAbertura: os.horaAbertura,
      dataFechamento: os.dataFechamento ? formatDateForInput(os.dataFechamento) : '',
      horaFechamento: os.horaFechamento || '',
      tipoManutencao: os.tipoManutencao,
      descricaoServico: os.descricaoServico,
      status: os.status,
      criarStandBy: false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dataService.deleteOrdemServico(id);
    setOrdensServico(dataService.getOrdensServico());
    toast({
      title: "Sucesso",
      description: "Ordem de serviço removida com sucesso."
    });
  };

  const getStatusColor = (status: OrdemServico['status']) => {
    switch (status) {
      case 'Aberta': return 'text-red-600 bg-red-50';
      case 'Em Andamento': return 'text-yellow-600 bg-yellow-50';
      case 'Aguardando Peça': return 'text-orange-600 bg-orange-50';
      case 'Concluída': return 'text-green-600 bg-green-50';
      case 'Cancelada': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setEditingOS(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOS ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoVeiculo">Tipo de Veículo *</Label>
                <Select 
                  value={formData.tipoVeiculo} 
                  onValueChange={handleTipoVeiculoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frota">Frota</SelectItem>
                    <SelectItem value="composicao">Composição</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipoVeiculo === 'frota' && (
                <div>
                  <Label htmlFor="veiculo">Nome da Frota *</Label>
                  <Select 
                    value={formData.veiculoId} 
                    onValueChange={handleVeiculoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frota..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cavalos.map(cavalo => (
                        <SelectItem key={cavalo.id} value={cavalo.id}>
                          {cavalo.nomeFreota}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.tipoVeiculo === 'composicao' && (
                <div>
                  <Label htmlFor="composicao">Composição *</Label>
                  <Select 
                    value={formData.composicaoId} 
                    onValueChange={handleComposicaoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a composição..." />
                    </SelectTrigger>
                    <SelectContent>
                      {composicoes.map(composicao => (
                        <SelectItem key={composicao.id} value={composicao.id}>
                          {composicao.identificador}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.tipoVeiculo === 'composicao' && formData.composicaoId && !editingOS && (
                <div>
                  <Label htmlFor="veiculoStandBy">Veículo para Stand-by (Opcional)</Label>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={formData.veiculoId} 
                      onValueChange={(value) => setFormData({...formData, veiculoId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o veículo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cavalos.map(cavalo => (
                          <SelectItem key={cavalo.id} value={cavalo.id}>
                            {cavalo.nomeFreota}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="placaReferente">Placa(s) Referente(s)</Label>
                <Input
                  id="placaReferente"
                  value={formData.placaReferente}
                  readOnly
                  className="bg-gray-100"
                  placeholder="Será preenchido automaticamente"
                />
              </div>

              {formData.tipoVeiculo === 'composicao' && formData.veiculoId && !editingOS && (
                <div className="md:col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id="criarStandBy"
                    checked={formData.criarStandBy}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, criarStandBy: checked as boolean})
                    }
                  />
                  <Label htmlFor="criarStandBy" className="text-sm">
                    Abrir OS Stand-by para o veículo selecionado
                  </Label>
                </div>
              )}

              <div>
                <Label htmlFor="dataAbertura">Data Abertura *</Label>
                <Input
                  id="dataAbertura"
                  type="date"
                  value={formData.dataAbertura}
                  onChange={(e) => setFormData({...formData, dataAbertura: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="horaAbertura">Hora Abertura *</Label>
                <Input
                  id="horaAbertura"
                  type="time"
                  value={formData.horaAbertura}
                  onChange={(e) => setFormData({...formData, horaAbertura: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="dataFechamento">Data Fechamento</Label>
                <Input
                  id="dataFechamento"
                  type="date"
                  value={formData.dataFechamento}
                  onChange={(e) => setFormData({...formData, dataFechamento: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="horaFechamento">Hora Fechamento</Label>
                <Input
                  id="horaFechamento"
                  type="time"
                  value={formData.horaFechamento}
                  onChange={(e) => setFormData({...formData, horaFechamento: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="tipoManutencao">Tipo Manutenção *</Label>
                <Select 
                  value={formData.tipoManutencao} 
                  onValueChange={(value: OrdemServico['tipoManutencao']) => 
                    setFormData({...formData, tipoManutencao: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventiva">Preventiva</SelectItem>
                    <SelectItem value="Corretiva">Corretiva</SelectItem>
                    <SelectItem value="Pneu">Pneu</SelectItem>
                    <SelectItem value="Elétrica">Elétrica</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: OrdemServico['status']) => 
                    setFormData({...formData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberta">Aberta</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Aguardando Peça">Aguardando Peça</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição do Serviço</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricaoServico}
                  onChange={(e) => setFormData({...formData, descricaoServico: e.target.value})}
                  placeholder="Descreva o serviço a ser realizado..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="md:col-span-2">
                <Button onClick={handleSubmit} className="w-full">
                  {editingOS ? 'Atualizar OS' : 'Criar OS'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Ordens de Serviço */}
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
                        onClick={() => handleEdit(os)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(os.id)}
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
    </div>
  );
};
