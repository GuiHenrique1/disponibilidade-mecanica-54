
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OrdemServico, CavaloMecanico, Composicao, Motorista } from '@/types';
import { OSFormData } from './OSFormData';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface OSFormProps {
  formData: OSFormData;
  setFormData: (data: OSFormData) => void;
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  motoristas: Motorista[];
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
  motoristas,
  editingOS,
  onSubmit,
  onTipoVeiculoChange,
  onVeiculoChange,
  onComposicaoChange
}) => {
  // Verificar se deve mostrar o checkbox Stand-by
  const showStandByCheckbox = formData.tipoVeiculo === 'composicao' && 
                              formData.composicaoId && 
                              !editingOS;

  const handleCavaloStandByChange = (cavaloId: string) => {
    setFormData({...formData, cavaloStandById: cavaloId});
  };

  // Função para obter o horário atual no fuso horário local
  const getCurrentLocalDateTime = () => {
    const now = new Date();
    // Converter para o fuso horário local do sistema
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localDateTime.toISOString().slice(0, 16);
  };

  // Configurar horário padrão se não estiver definido
  React.useEffect(() => {
    if (!formData.dataHoraAbertura && !editingOS) {
      setFormData({
        ...formData,
        dataHoraAbertura: getCurrentLocalDateTime()
      });
    }
  }, []);

  // Opções para busca de motoristas
  const motoristaOptions = motoristas.map(motorista => ({
    value: motorista.id,
    label: motorista.nome,
    searchText: motorista.nome
  }));

  // Opções para busca de cavalos
  const cavaloOptions = cavalos.map(cavalo => ({
    value: cavalo.id,
    label: `${cavalo.nomeFreota} - ${cavalo.placa}`,
    searchText: `${cavalo.nomeFreota} ${cavalo.placa}`
  }));

  // Opções para busca de composições
  const composicaoOptions = composicoes.map(composicao => ({
    value: composicao.id,
    label: `${composicao.identificador} - ${composicao.primeiraComposicao} ${composicao.segundaComposicao}`,
    searchText: `${composicao.identificador} ${composicao.primeiraComposicao} ${composicao.segundaComposicao}`
  }));

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
          <SearchableSelect
            label="Nome da Frota *"
            options={cavaloOptions}
            value={formData.veiculoId}
            onValueChange={onVeiculoChange}
            placeholder="Buscar frota..."
          />
        </div>
      )}

      {formData.tipoVeiculo === 'composicao' && (
        <div>
          <SearchableSelect
            label="Composição *"
            options={composicaoOptions}
            value={formData.composicaoId}
            onValueChange={onComposicaoChange}
            placeholder="Buscar composição..."
          />
        </div>
      )}

      {showStandByCheckbox && (
        <div className="md:col-span-2">
          <SearchableSelect
            label="Cavalo Mecânico para Stand-by"
            options={cavaloOptions}
            value={formData.cavaloStandById}
            onValueChange={handleCavaloStandByChange}
            placeholder="Buscar cavalo para Stand-by..."
          />
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

      <div className="md:col-span-2">
        <SearchableSelect
          label="Motorista Responsável"
          options={motoristaOptions}
          value={formData.motoristaId}
          onValueChange={(value) => setFormData({...formData, motoristaId: value})}
          placeholder="Buscar motorista..."
        />
      </div>

      {showStandByCheckbox && (
        <div className="md:col-span-2 flex items-center space-x-2 p-3 border rounded-md bg-blue-50">
          <Checkbox
            id="criarStandBy"
            checked={formData.criarStandBy}
            onCheckedChange={(checked) => {
              setFormData({...formData, criarStandBy: checked as boolean});
            }}
          />
          <Label htmlFor="criarStandBy" className="text-sm font-medium">
            Abrir OS Stand-by para Veículo Selecionado
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
        <Label htmlFor="dataHoraPrevisaoLiberacao">Previsão de Liberação</Label>
        <Input
          id="dataHoraPrevisaoLiberacao"
          type="datetime-local"
          value={formData.dataHoraPrevisaoLiberacao}
          onChange={(e) => setFormData({...formData, dataHoraPrevisaoLiberacao: e.target.value})}
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
            <SelectItem value="STAND-BY">STAND-BY</SelectItem>
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
