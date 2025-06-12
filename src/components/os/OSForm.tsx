
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';
import { OSFormData } from './OSFormData';

interface OSFormProps {
  formData: OSFormData;
  setFormData: (data: OSFormData) => void;
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  editingOS: OrdemServico | null;
  onSubmit: () => void;
  onTipoVeiculoChange: (tipo: 'frota' | 'composicao') => void;
  onVeiculoChange: (veiculoId: string) => void;
  onComposicaoChange: (composicaoId: string) => void;
}

export const OSForm: React.FC<OSFormProps> = ({
  formData,
  setFormData,
  cavalos,
  composicoes,
  editingOS,
  onSubmit,
  onTipoVeiculoChange,
  onVeiculoChange,
  onComposicaoChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="tipoVeiculo">Tipo de Veículo *</Label>
        <Select value={formData.tipoVeiculo} onValueChange={onTipoVeiculoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frota">FROTA</SelectItem>
            <SelectItem value="composicao">COMPOSIÇÃO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.tipoVeiculo === 'frota' && (
        <div>
          <Label htmlFor="veiculo">Nome da Frota *</Label>
          <Select value={formData.veiculoId} onValueChange={onVeiculoChange}>
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
          <Select value={formData.composicaoId} onValueChange={onComposicaoChange}>
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

      {formData.tipoVeiculo === 'composicao' && formData.composicaoId && !editingOS && (
        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="criarStandBy"
            checked={formData.criarStandBy}
            onCheckedChange={(checked) => 
              setFormData({...formData, criarStandBy: checked as boolean})
            }
          />
          <Label htmlFor="criarStandBy" className="text-sm">
            Abrir OS Stand-by para Veículo
          </Label>
        </div>
      )}

      <div className="md:col-span-2">
        <Label htmlFor="dataHoraAbertura">Data e Hora Abertura *</Label>
        <Input
          id="dataHoraAbertura"
          type="datetime-local"
          value={formData.dataHoraAbertura}
          onChange={(e) => setFormData({...formData, dataHoraAbertura: e.target.value})}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="dataHoraFechamento">Data e Hora Fechamento</Label>
        <Input
          id="dataHoraFechamento"
          type="datetime-local"
          value={formData.dataHoraFechamento}
          onChange={(e) => setFormData({...formData, dataHoraFechamento: e.target.value})}
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
            <SelectItem value="Preventiva">PREVENTIVA</SelectItem>
            <SelectItem value="Corretiva">CORRETIVA</SelectItem>
            <SelectItem value="Pneu">PNEU</SelectItem>
            <SelectItem value="Elétrica">ELÉTRICA</SelectItem>
            <SelectItem value="SOS">SOS</SelectItem>
            <SelectItem value="TERMAC">TERMAC</SelectItem>
            <SelectItem value="ITR">ITR</SelectItem>
            <SelectItem value="Outros">OUTROS</SelectItem>
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
            <SelectItem value="Aberta">ABERTA</SelectItem>
            <SelectItem value="Concluída">CONCLUÍDA</SelectItem>
            <SelectItem value="Cancelada">CANCELADA</SelectItem>
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
        <Button onClick={onSubmit} className="w-full">
          {editingOS ? 'Atualizar OS' : 'Criar OS'}
        </Button>
      </div>
    </div>
  );
};
