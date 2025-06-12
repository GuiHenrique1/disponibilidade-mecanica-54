
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

    const totalDisponiveis = Math.max(0, totalFrota - veiculosIndisponiveis);
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

export function calcularEstatisticasOS(ordensServico: OrdemServico[]): any {
  const totalOS = ordensServico.length;
  const osAbertas = ordensServico.filter(os => os.status === 'Aberta').length;
  const osEmAndamento = ordensServico.filter(os => os.status === 'Em Andamento').length;
  const osAguardandoPeca = ordensServico.filter(os => os.status === 'Aguardando Peça').length;
  const osConcluidas = ordensServico.filter(os => os.status === 'Concluída').length;
  const osCanceladas = ordensServico.filter(os => os.status === 'Cancelada').length;

  // Calcular tempo médio de resolução para OS concluídas
  const osConcluidas_dados = ordensServico.filter(os => os.status === 'Concluída' && os.dataFechamento);
  let tempoMedioResolucao = 0;

  if (osConcluidas_dados.length > 0) {
    const tempos = osConcluidas_dados.map(os => {
      const [diaAb, mesAb, anoAb] = os.dataAbertura.split('-');
      const [horaAb, minAb] = os.horaAbertura.split(':');
      const dataAbertura = new Date(`${anoAb}-${mesAb}-${diaAb}T${horaAb}:${minAb}:00`);

      const [diaFe, mesFe, anoFe] = os.dataFechamento!.split('-');
      const [horaFe, minFe] = os.horaFechamento ? os.horaFechamento.split(':') : ['23', '59'];
      const dataFechamento = new Date(`${anoFe}-${mesFe}-${diaFe}T${horaFe}:${minFe}:00`);

      return (dataFechamento.getTime() - dataAbertura.getTime()) / (1000 * 60 * 60); // em horas
    });

    tempoMedioResolucao = tempos.reduce((acc, curr) => acc + curr, 0) / tempos.length;
  }

  return {
    totalOS,
    osAbertas,
    osEmAndamento,
    osAguardandoPeca,
    osConcluidas,
    osCanceladas,
    tempoMedioResolucao
  };
}
