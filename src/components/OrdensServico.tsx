
import React from 'react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { useOSForm } from '@/hooks/useOSForm';
import { OSDialog } from './os/OSDialog';
import { OSList } from './os/OSList';

export const OrdensServico: React.FC = () => {
  const { ordensServico, cavalos, composicoes, addOrdemServico, updateOrdemServico, deleteOrdemServico } = useAppData();

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
  }, cavalos, composicoes);

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFinalize={handleFinalize}
      />
    </div>
  );
};
