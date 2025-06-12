
import { OrdemServico, DadosDisponibilidade } from '@/types';

export function calcularDisponibilidade(
  totalFrota: number,
  ordensServico: OrdemServico[],
  dataAnalise: string,
  tipoVeiculo: 'cavalo' | 'composicao'
): DadosDisponibilidade {
  const disponibilidadePorHora = [];

  for (let hora = 0; hora < 24; hora++) {
    const dataHoraAnalise = new Date(`${dataAnalise.split('-').reverse().join('-')}T${hora.toString().padStart(2, '0')}:00:00`);
    
    const veiculosIndisponiveis = ordensServico.filter(os => {
      if (os.tipoVeiculo !== tipoVeiculo) return false;
      
      // Verificar se a OS está em status que causa indisponibilidade
      const statusIndisponivel = ['Aberta', 'Em Andamento', 'Aguardando Peça'].includes(os.status);
      if (!statusIndisponivel) return false;

      // Criar data/hora de abertura
      const [diaAbertura, mesAbertura, anoAbertura] = os.dataAbertura.split('-');
      const [horaAbertura, minutoAbertura] = os.horaAbertura.split(':');
      const dataAbertura = new Date(`${anoAbertura}-${mesAbertura}-${diaAbertura}T${horaAbertura}:${minutoAbertura}:00`);

      // Se a OS ainda está aberta, verificar se a hora de análise está após a abertura
      if (!os.dataFechamento) {
        return dataHoraAnalise >= dataAbertura;
      }

      // Se a OS foi fechada, verificar se a hora de análise está no período de indisponibilidade
      const [diaFechamento, mesFechamento, anoFechamento] = os.dataFechamento.split('-');
      const [horaFechamento, minutoFechamento] = os.horaFechamento ? os.horaFechamento.split(':') : ['23', '59'];
      const dataFechamento = new Date(`${anoFechamento}-${mesFechamento}-${diaFechamento}T${horaFechamento}:${minutoFechamento}:00`);

      return dataHoraAnalise >= dataAbertura && dataHoraAnalise <= dataFechamento;
    }).length;

    const totalDisponiveis = totalFrota - veiculosIndisponiveis;
    const percentualDisponibilidade = totalFrota > 0 ? (totalDisponiveis / totalFrota) * 100 : 100;

    disponibilidadePorHora.push({
      hora,
      totalDisponiveis,
      totalIndisponiveis: veiculosIndisponiveis,
      percentualDisponibilidade
    });
  }

  const mediaDisponibilidade = disponibilidadePorHora.reduce((acc, curr) => acc + curr.percentualDisponibilidade, 0) / 24;
  const mediaVeiculosDisponiveis = disponibilidadePorHora.reduce((acc, curr) => acc + curr.totalDisponiveis, 0) / 24;

  return {
    totalFrota,
    disponibilidadePorHora,
    mediaDisponibilidade,
    mediaVeiculosDisponiveis
  };
}
