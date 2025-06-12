
import React from 'react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOSForm } from '@/hooks/useOSForm';
import { OSDialog } from './os/OSDialog';
import { OSList } from './os/OSList';

export const OrdensServico: React.FC = () => {
  const [ordensServico, setOrdensServico] = useLocalStorage<OrdemServico[]>('ordens-servico', []);
  const [cavalos] = useLocalStorage<CavaloMecanico[]>('cavalos-mecanicos', []);
  const [composicoes] = useLocalStorage<Composicao[]>('composicoes', []);

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
  } = useOSForm(ordensServico, setOrdensServico, cavalos, composicoes);

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
