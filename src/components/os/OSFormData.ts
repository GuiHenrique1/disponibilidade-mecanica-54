
import { OrdemServico } from '@/types';

export interface OSFormData {
  tipoVeiculo: 'frota' | 'composicao' | '';
  veiculoId: string;
  composicaoId: string;
  placaReferente: string;
  motoristaId: string;
  dataHoraAbertura: string;
  dataHoraFechamento: string;
  dataHoraPrevisaoLiberacao: string;
  tipoManutencao: OrdemServico['tipoManutencao'] | '';
  descricaoServico: string;
  status: OrdemServico['status'] | '';
  criarStandBy: boolean;
  cavaloStandById: string;
}

export const initialFormData: OSFormData = {
  tipoVeiculo: '',
  veiculoId: '',
  composicaoId: '',
  placaReferente: '',
  motoristaId: '',
  dataHoraAbertura: '',
  dataHoraFechamento: '',
  dataHoraPrevisaoLiberacao: '',
  tipoManutencao: '',
  descricaoServico: '',
  status: '',
  criarStandBy: false,
  cavaloStandById: ''
};
