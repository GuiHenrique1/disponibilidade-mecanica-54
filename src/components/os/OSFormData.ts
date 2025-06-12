
import { OrdemServico } from '@/types';

export interface OSFormData {
  tipoVeiculo: 'frota' | 'composicao' | '';
  veiculoId: string;
  composicaoId: string;
  placaReferente: string;
  dataHoraAbertura: string;
  dataHoraFechamento: string;
  tipoManutencao: OrdemServico['tipoManutencao'] | '';
  descricaoServico: string;
  status: OrdemServico['status'] | '';
  criarStandBy: boolean;
}

export const initialFormData: OSFormData = {
  tipoVeiculo: '',
  veiculoId: '',
  composicaoId: '',
  placaReferente: '',
  dataHoraAbertura: '',
  dataHoraFechamento: '',
  tipoManutencao: '',
  descricaoServico: '',
  status: '',
  criarStandBy: false
};
