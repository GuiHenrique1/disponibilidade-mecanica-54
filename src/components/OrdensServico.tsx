
import React from 'react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { useOSForm } from '@/hooks/useOSForm';
import { OSDialog } from './os/OSDialog';
import { OSList } from './os/OSList';

export const OrdensServico: React.FC = () => {
  const { 
    ordensServico, 
    cavalos, 
    composicoes, 
    motoristas,
    addOrdemServico, 
    updateOrdemServico, 
    deleteOrdemServico,
    refreshData 
  } = useAppData();

  // Log para debug
  console.log('OrdensServico - Dados carregados:', {
    ordensServico: ordensServico.length,
    cavalos: cavalos.length,
    composicoes: composicoes.length,
    motoristas: motoristas.length
  });

  const {
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
  } = useOSForm(ordensServico, (updatedOS: OrdemServico[]) => {
    // Esta função não é mais necessária pois o context gerencia o estado
    // Mantemos para compatibilidade com o hook existente
  }, cavalos, composicoes, motoristas);

  const handleRefresh = async () => {
    try {
      if (refreshData) {
        console.log('Atualizando dados...');
        await refreshData();
        console.log('Dados atualizados com sucesso');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
        
        <OSDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingOS={editingOS}
          formData={formData}
          setFormData={setFormData}
          cavalos={cavalos}
          composicoes={composicoes}
          motoristas={motoristas}
          validationError={validationError}
          onSubmit={handleSubmit}
          onTipoVeiculoChange={handleTipoVeiculoChange}
          onVeiculoChange={handleVeiculoChange}
          onComposicaoChange={handleComposicaoChange}
          onResetForm={resetForm}
          onSetEditingOS={setEditingOS}
        />
      </div>

      <OSList
        ordensServico={ordensServico}
        cavalos={cavalos}
        composicoes={composicoes}
        motoristas={motoristas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFinalize={handleFinalize}
        onRefresh={handleRefresh}
      />
    </div>
  );
};
