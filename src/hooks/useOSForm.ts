import { useState } from 'react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '@/services/dataService';
import { OSFormData, initialFormData } from '@/components/os/OSFormData';
import { formatDateTimeForInput, formatDateTimeForStorage } from '@/components/os/OSFormUtils';
import { validateUniqueOS } from '@/components/os/OSValidation';

export const useOSForm = (
  ordensServico: OrdemServico[],
  setOrdensServico: (os: OrdemServico[]) => void,
  cavalos: CavaloMecanico[],
  composicoes: Composicao[]
) => {
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
      criarStandBy: false,
      cavaloStandById: ''
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

  const handleFinalize = (os: OrdemServico) => {
    const agora = new Date();
    const dataHoraAtual = agora.toISOString().slice(0, 16);
    
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
      criarStandBy: false,
      cavaloStandById: ''
    });
    setValidationError('');
    setIsDialogOpen(true);
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
      criarStandBy: false,
      cavaloStandById: ''
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

    // Verificar se o cavalo foi selecionado quando Stand-by está marcado
    if (formData.criarStandBy && !formData.cavaloStandById) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o cavalo mecânico para a OS Stand-by.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe uma OS aberta para este veículo (apenas para novas OS)
    if (!editingOS && formData.status === 'Aberta') {
      const errorMessage = validateUniqueOS(ordensServico, selectedVehicleId, formData.tipoVeiculo, cavalos, composicoes);
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
        // Criar a OS principal
        const novaOS = dataService.addOrdemServico(osData);
        console.log('OS criada:', novaOS);
        console.log('Criar Stand-by:', formData.criarStandBy);
        console.log('Cavalo Stand-by ID:', formData.cavaloStandById);
        
        // Verificar se deve criar OS Stand-by
        if (formData.criarStandBy && formData.cavaloStandById) {
          console.log('Iniciando criação de OS Stand-by...');
          
          const cavaloStandBy = cavalos.find(c => c.id === formData.cavaloStandById);
          console.log('Cavalo para Stand-by encontrado:', cavaloStandBy);
          
          if (cavaloStandBy) {
            // Verificar se o cavalo já tem uma OS aberta antes de criar a stand-by
            const ordensAtual = dataService.getOrdensServico(); // Buscar dados atualizados
            const standByError = validateUniqueOS(ordensAtual, cavaloStandBy.id, 'frota', cavalos, composicoes);
            console.log('Erro de validação Stand-by:', standByError);
            
            if (!standByError) {
              const composicao = composicoes.find(c => c.id === formData.composicaoId);
              const osStandBy: Omit<OrdemServico, 'id' | 'createdAt'> = {
                tipoVeiculo: 'frota',
                veiculoId: cavaloStandBy.id,
                placaReferente: cavaloStandBy.placa,
                dataAbertura,
                horaAbertura,
                dataFechamento: dataFechamento || undefined,
                horaFechamento: horaFechamento || undefined,
                tipoManutencao: formData.tipoManutencao,
                descricaoServico: `STAND-BY ${composicao?.identificador || ''} - ${formData.descricaoServico}`,
                status: formData.status,
                isStandBy: true,
                composicaoOrigemId: formData.composicaoId
              };
              
              console.log('Criando OS Stand-by com dados:', osStandBy);
              const osStandByCriada = dataService.addOrdemServico(osStandBy);
              console.log('OS Stand-by criada:', osStandByCriada);
              
              toast({
                title: "Sucesso",
                description: "Ordem de serviço da composição e OS Stand-by do veículo criadas com sucesso."
              });
            } else {
              console.log('Não foi possível criar Stand-by:', standByError);
              toast({
                title: "Aviso",
                description: `OS da composição criada, mas não foi possível criar a OS Stand-by: ${standByError}`
              });
            }
          } else {
            console.log('Cavalo mecânico não encontrado para ID:', formData.cavaloStandById);
            toast({
              title: "Aviso",
              description: "OS da composição criada, mas não foi possível encontrar o cavalo mecânico para criar a OS Stand-by."
            });
          }
        } else {
          toast({
            title: "Sucesso",
            description: "Ordem de serviço criada com sucesso."
          });
        }
        
        // Atualizar a lista de OS
        setOrdensServico(dataService.getOrdensServico());
      }

      resetForm();
      setEditingOS(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar OS:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ordem de serviço.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    dataService.deleteOrdemServico(id);
    setOrdensServico(dataService.getOrdensServico());
    toast({
      title: "Sucesso",
      description: "Ordem de serviço removida com sucesso."
    });
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingOS,
    setEditingOS,
    formData,
    setFormData,
    validationError,
    resetForm,
    handleTipoVeiculoChange,
    handleVeiculoChange,
    handleComposicaoChange,
    handleFinalize,
    handleEdit,
    handleSubmit,
    handleDelete
  };
};
