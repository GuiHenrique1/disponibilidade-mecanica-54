
import { CavaloMecanico, Composicao, Motorista, OrdemServico } from '@/types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateCavalo = (cavalo: Partial<CavaloMecanico>): void => {
  if (!cavalo.placa || cavalo.placa.trim().length === 0) {
    throw new ValidationError('Placa é obrigatória');
  }

  if (cavalo.placa.trim().length < 3) {
    throw new ValidationError('Placa deve ter pelo menos 3 caracteres');
  }
};

export const validateComposicao = (composicao: Partial<Composicao>): void => {
  if (!composicao.identificador || composicao.identificador.trim().length === 0) {
    throw new ValidationError('Identificador é obrigatório');
  }

  if (!composicao.placas || composicao.placas.length === 0) {
    throw new ValidationError('Pelo menos uma placa é obrigatória');
  }

  if (composicao.placas.some(placa => !placa || placa.trim().length === 0)) {
    throw new ValidationError('Todas as placas devem ser válidas');
  }
};

export const validateMotorista = (motorista: Partial<Motorista>): void => {
  if (!motorista.nome || motorista.nome.trim().length === 0) {
    throw new ValidationError('Nome é obrigatório');
  }

  if (motorista.nome.trim().length < 2) {
    throw new ValidationError('Nome deve ter pelo menos 2 caracteres');
  }
};

export const validateOrdemServico = (os: Partial<OrdemServico>): void => {
  if (!os.veiculoId || os.veiculoId.trim().length === 0) {
    throw new ValidationError('Veículo é obrigatório');
  }

  if (!os.tipoVeiculo || !['cavalo', 'composicao'].includes(os.tipoVeiculo)) {
    throw new ValidationError('Tipo de veículo inválido');
  }

  if (!os.dataAbertura || !isValidDate(os.dataAbertura)) {
    throw new ValidationError('Data de abertura inválida');
  }

  if (!os.horaAbertura || !isValidTime(os.horaAbertura)) {
    throw new ValidationError('Hora de abertura inválida');
  }

  if (!os.tipoManutencao || !['Preventiva', 'Corretiva', 'Pneu', 'Elétrica', 'Outros'].includes(os.tipoManutencao)) {
    throw new ValidationError('Tipo de manutenção inválido');
  }

  if (!os.status || !['Aberta', 'Em Andamento', 'Aguardando Peça', 'Concluída', 'Cancelada'].includes(os.status)) {
    throw new ValidationError('Status inválido');
  }

  // Validar datas de fechamento se preenchidas
  if (os.dataFechamento && !isValidDate(os.dataFechamento)) {
    throw new ValidationError('Data de fechamento inválida');
  }

  if (os.horaFechamento && !isValidTime(os.horaFechamento)) {
    throw new ValidationError('Hora de fechamento inválida');
  }

  // Validar se data/hora de fechamento são posteriores à abertura
  if (os.dataFechamento && os.horaFechamento) {
    const dataAbertura = parseDate(os.dataAbertura, os.horaAbertura);
    const dataFechamento = parseDate(os.dataFechamento, os.horaFechamento);
    
    if (dataFechamento <= dataAbertura) {
      throw new ValidationError('Data/hora de fechamento deve ser posterior à abertura');
    }
  }
};

const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

const isValidTime = (timeStr: string): boolean => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
};

const parseDate = (dateStr: string, timeStr: string): Date => {
  const [day, month, year] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTimeForDisplay = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTimeForDisplay = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
