import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '@/services/dataService';
import { OSForm } from './os/OSForm';
import { OSList } from './os/OSList';
import { OSFormData, initialFormData } from './os/OSFormData';
import { formatDateTimeForInput, formatDateTimeForStorage } from './os/OSFormUtils';

export const OrdensServico: React.FC = () => {
  const [ordensServico, setOrdensServico] = useLocalStorage<OrdemServico[]>('ordens-servico', []);
  const [cavalos] = useLocalStorage<CavaloMecanico[]>('cavalos-mecanicos', []);
  const [composicoes] = useLocalStorage<Composicao[]>('composicoes', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null);
  const [formData, setFormData] = useState<OSFormData>(initialFormData);
  const [validationError, setValidationError] = useState<string>('');
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationError('');
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
    setValidationError('');
  };

  const handleVeiculoChange = (veiculoId: string) => {
    const cavalo = cavalos.find(c => c.id === veiculoId);
    setFormData({
      ...formData,
      veiculoId,
      placaReferente: cavalo ? cavalo.placa : ''
    });
    setValidationError('');
  };

  const handleComposicaoChange = (composicaoId: string) => {
    const composicao = composicoes.find(c => c.id === composicaoId);
    setFormData({
      ...formData,
      composicaoId,
      placaReferente: composicao ? `${composicao.primeiraComposicao} ${composicao.segundaComposicao}` : ''
    });
    setValidationError('');
  };

  const checkForOpenOS = (veiculoId: string, tipoVeiculo: 'frota' | 'composicao'): string | null => {
    const osAbertas = ordensServico.filter(os => os.status === 'Aberta' && os.veiculoId === veiculoId && os.tipoVeiculo === tipoVeiculo);
    
    if (osAbertas.length > 0) {
      if (tipoVeiculo === 'frota') {
        const cavalo = cavalos.find(c => c.id === veiculoId);
        return `Já existe uma OS aberta para o veículo ${cavalo?.nomeFreota || 'não identificado'}`;
      } else {
        const composicao = composicoes.find(c => c.id === veiculoId);
        return `Já existe uma OS aberta para a composição ${composicao?.identificador || 'não identificada'}`;
      }
    }
    
    return null;
  };

  const handleFinalize = (os: OrdemServico) => {
    // Criar um input datetime-local diretamente com o horário atual
    const agora = new Date();
    const offset = agora.getTimezoneOffset() * 60000; // offset em millisegundos
    const localTime = new Date(agora.getTime() - offset);
    const dataHoraAtual = localTime.toISOString().slice(0, 16);
    
    setEditingOS(os);
    const dataHoraAbertura = formatDateTimeForInput(os.dataAbertura, os.horaAbertura);

    setFormData({
      tipoVeiculo: os.tipoVeiculo,
      veiculoId: os.tipoVeiculo === 'frota' ? os.veiculoId : '',
      composicaoId: os.tipoVeiculo === 'composicao' ? os.veiculoId : '',
      placaReferente: os.placaReferente,
      dataHoraAbertura,
      dataHoraFechamento: dataHoraAtual,
      tipoManutencao: os.tipoManutencao,
      descricaoServico: os.descricaoServico,
      status: 'Concluída',
      criarStandBy: false
    });
    setValidationError('');
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const selectedVehicleId = formData.tipoVeiculo === 'frota' ? formData.veiculoId : formData.composicaoId;
    
    if (!formData.tipoVeiculo || !selectedVehicleId || !formData.dataHoraAbertura || 
        !formData.tipoManutencao || !formData.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe uma OS aberta para este veículo (apenas para novas OS)
    if (!editingOS && formData.status === 'Aberta') {
      const errorMessage = checkForOpenOS(selectedVehicleId, formData.tipoVeiculo);
      if (errorMessage) {
        setValidationError(errorMessage);
        return;
      }
    }

    const { date: dataAbertura, time: horaAbertura } = formatDateTimeForStorage(formData.dataHoraAbertura);
    const { date: dataFechamento, time: horaFechamento } = formData.dataHoraFechamento 
      ? formatDateTimeForStorage(formData.dataHoraFechamento) 
      : { date: '', time: '' };

    const osData: Omit<OrdemServico, 'id' | 'createdAt'> = {
      tipoVeiculo: formData.tipoVeiculo,
      veiculoId: selectedVehicleId,
      placaReferente: formData.placaReferente,
      dataAbertura,
      horaAbertura,
      dataFechamento: dataFechamento || undefined,
      horaFechamento: horaFechamento || undefined,
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
        
        if (formData.criarStandBy && formData.tipoVeiculo === 'composicao' && formData.composicaoId) {
          const composicao = composicoes.find(c => c.id === formData.composicaoId);
          
          if (composicao && composicao.primeiraComposicao) {
            const cavaloStandBy = cavalos.find(c => c.placa === composicao.primeiraComposicao);
            
            if (cavaloStandBy) {
              // Verificar se o cavalo já tem uma OS aberta antes de criar a stand-by
              const standByError = checkForOpenOS(cavaloStandBy.id, 'frota');
              if (!standByError) {
                const osStandBy: Omit<OrdemServico, 'id' | 'createdAt'> = {
                  tipoVeiculo: 'frota',
                  veiculoId: cavaloStandBy.id,
                  placaReferente: cavaloStandBy.placa,
                  dataAbertura,
                  horaAbertura,
                  dataFechamento: dataFechamento || undefined,
                  horaFechamento: horaFechamento || undefined,
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
                  description: `OS da composição criada, mas não foi possível criar a OS Stand-by: ${standByError}`
                });
              }
            } else {
              toast({
                title: "Aviso",
                description: "OS da composição criada, mas não foi possível criar a OS Stand-by do veículo."
              });
            }
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
    const dataHoraAbertura = formatDateTimeForInput(os.dataAbertura, os.horaAbertura);
    const dataHoraFechamento = os.dataFechamento && os.horaFechamento 
      ? formatDateTimeForInput(os.dataFechamento, os.horaFechamento) 
      : '';

    setFormData({
      tipoVeiculo: os.tipoVeiculo,
      veiculoId: os.tipoVeiculo === 'frota' ? os.veiculoId : '',
      composicaoId: os.tipoVeiculo === 'composicao' ? os.veiculoId : '',
      placaReferente: os.placaReferente,
      dataHoraAbertura,
      dataHoraFechamento,
      tipoManutencao: os.tipoManutencao,
      descricaoServico: os.descricaoServico,
      status: os.status,
      criarStandBy: false
    });
    setValidationError('');
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
            
            {validationError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {validationError}
              </div>
            )}
            
            <OSForm
              formData={formData}
              setFormData={setFormData}
              cavalos={cavalos}
              composicoes={composicoes}
              editingOS={editingOS}
              onSubmit={handleSubmit}
              onTipoVeiculoChange={handleTipoVeiculoChange}
              onVeiculoChange={handleVeiculoChange}
              onComposicaoChange={handleComposicaoChange}
            />
          </DialogContent>
        </Dialog>
      </div>

      <OSList
        ordensServico={ordensServico}
        cavalos={cavalos}
        composicoes={composicoes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFinalize={handleFinalize}
      />
    </div>
  );
};
