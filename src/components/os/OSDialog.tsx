
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { OSForm } from './OSForm';
import { OSFormData } from './OSFormData';

interface OSDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingOS: OrdemServico | null;
  formData: OSFormData;
  setFormData: (data: OSFormData) => void;
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  validationError: string;
  onSubmit: () => void;
  onTipoVeiculoChange: (tipo: 'frota' | 'composicao') => void;
  onVeiculoChange: (veiculoId: string) => void;
  onComposicaoChange: (composicaoId: string) => void;
  onResetForm: () => void;
  onSetEditingOS: (os: OrdemServico | null) => void;
}

export const OSDialog: React.FC<OSDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  editingOS,
  formData,
  setFormData,
  cavalos,
  composicoes,
  validationError,
  onSubmit,
  onTipoVeiculoChange,
  onVeiculoChange,
  onComposicaoChange,
  onResetForm,
  onSetEditingOS
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {
          onResetForm();
          onSetEditingOS(null);
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
          <DialogDescription>
            {!editingOS && "Preencha os dados para criar uma nova ordem de serviço. Para composições, você pode criar automaticamente uma OS Stand-by para o veículo."}
          </DialogDescription>
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
          onSubmit={onSubmit}
          onTipoVeiculoChange={onTipoVeiculoChange}
          onVeiculoChange={onVeiculoChange}
          onComposicaoChange={onComposicaoChange}
        />
      </DialogContent>
    </Dialog>
  );
};
