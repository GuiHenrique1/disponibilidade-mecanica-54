
export interface CavaloMecanico {
  id: string;
  placa: string;
  createdAt: Date;
}

export interface Composicao {
  id: string;
  identificador: string; // ex: C01, C02
  placas: string[]; // ex: ['QAH0J25', 'QAH0J27']
  createdAt: Date;
}

export interface Motorista {
  id: string;
  nome: string;
  createdAt: Date;
}

export interface OrdemServico {
  id: string;
  veiculoId: string; // ID do cavalo ou composição
  tipoVeiculo: 'cavalo' | 'composicao';
  dataAbertura: string; // DD-MM-AAAA
  horaAbertura: string; // HH:MM
  dataFechamento?: string;
  horaFechamento?: string;
  tipoManutencao: 'Preventiva' | 'Corretiva' | 'Pneu' | 'Elétrica' | 'Outros';
  descricaoServico: string;
  status: 'Aberta' | 'Em Andamento' | 'Aguardando Peça' | 'Concluída' | 'Cancelada';
  createdAt: Date;
}

export interface DisponibilidadeHora {
  hora: number;
  totalDisponiveis: number;
  totalIndisponiveis: number;
  percentualDisponibilidade: number;
}

export interface DadosDisponibilidade {
  totalFrota: number;
  disponibilidadePorHora: DisponibilidadeHora[];
  mediaDisponibilidade: number;
  mediaVeiculosDisponiveis: number;
}
