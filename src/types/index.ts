export interface CavaloMecanico {
  id: string;
  nomeFreota: string; // Nome da frota (ex: T2506)
  placa: string;
  createdAt: Date;
}

export interface Composicao {
  id: string;
  identificador: string; // ex: C01, C02
  placas: string[]; // Array de placas da composição
  primeiraComposicao: string; // ex: 'QAH0J25'
  segundaComposicao: string; // ex: 'QAH0J27'
  createdAt: Date;
}

export interface Motorista {
  id: string;
  nome: string;
  createdAt: Date;
}

export interface OrdemServico {
  id: string;
  tipoVeiculo: 'frota' | 'composicao';
  veiculoId: string; // ID do cavalo ou composição
  placaReferente: string; // Placa(s) do veículo/composição
  motoristaId?: string; // ID do motorista responsável
  dataAbertura: string; // DD-MM-AAAA
  horaAbertura: string; // HH:MM
  dataFechamento?: string;
  horaFechamento?: string;
  previsaoLiberacao?: string; // DD-MM-AAAA
  horaPrevisaoLiberacao?: string; // HH:MM
  tipoManutencao: 'Preventiva' | 'Corretiva' | 'Pneu' | 'Elétrica' | 'SOS' | 'TERMAC' | 'ITR' | 'STAND-BY' | 'Outros';
  descricaoServico: string;
  status: 'Aberta' | 'Concluída' | 'Cancelada';
  isStandBy?: boolean; // Indica se é uma OS stand-by
  composicaoOrigemId?: string; // ID da composição que originou esta OS stand-by
  createdAt: Date;
}

export interface DisponibilidadeHora {
  hora: number;
  totalDisponiveis: number | null;
  totalIndisponiveis: number | null;
  percentualDisponibilidade: number | null;
  isHoraFutura?: boolean; // Added to support future hour detection
}

export interface DadosDisponibilidade {
  totalFrota: number;
  disponibilidadePorHora: DisponibilidadeHora[];
  mediaDisponibilidade: number;
  mediaVeiculosDisponiveis: number;
  isTempoReal?: boolean;
  horaAtual?: number;
}

// Interfaces para relatórios e estatísticas
export interface RelatorioDisponibilidade {
  dataAnalise: string;
  tipoVeiculo: 'frota' | 'composicao';
  dadosDisponibilidade: DadosDisponibilidade;
  metaDefinida: number;
  metaAtingida: boolean;
}

export interface EstatisticasOS {
  totalOS: number;
  osAbertas: number;
  osEmAndamento: number;
  osAguardandoPeca: number;
  osConcluidas: number;
  osCanceladas: number;
  tempoMedioResolucao: number; // em horas
}
