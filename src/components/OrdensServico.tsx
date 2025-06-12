
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
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormData);
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
      placaReferente: composicao ? `${composicao.primeiraComposicao} ${composicao.segundaComposicao}` : ''
    });
  };

  const handleFinalize = (os: OrdemServico) => {
    const now = new Date();
    // Corrigir o formato para usar o horário local correto
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dataHoraAtual = `${year}-${month}-${day}T${hours}:${minutes}`;
    
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
