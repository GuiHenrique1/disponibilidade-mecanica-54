import { OrdemServico, DadosDisponibilidade } from '@/types';

export function calcularDisponibilidade(
  totalFrota: number,
  ordensServico: OrdemServico[],
  dataAnalise: string,
  tipoVeiculo: 'frota' | 'composicao'
): DadosDisponibilidade {
  const disponibilidadePorHora = [];
  
  // Verificar se é análise do dia atual usando fuso horário local
  const hoje = new Date();
  const [diaAnalise, mesAnalise, anoAnalise] = dataAnalise.split('-');
  
  // Criar data de análise em fuso horário local
  const dataAnaliseDate = new Date(
    parseInt(anoAnalise), 
    parseInt(mesAnalise) - 1, 
    parseInt(diaAnalise)
  );
  
  // Comparar apenas as datas (ignorando horário)
  const isHoje = dataAnaliseDate.toDateString() === hoje.toDateString();
  
  // Se for hoje, pegar apenas até a hora atual, senão até 23h
  const horaLimite = isHoje ? hoje.getHours() : 23;

  // Calcular apenas até a hora limite
  for (let hora = 0; hora <= horaLimite; hora++) {
    // Criar data/hora de análise em fuso horário local
    const dataHoraAnalise = new Date(
      parseInt(anoAnalise),
      parseInt(mesAnalise) - 1,
      parseInt(diaAnalise),
      hora,
      0,
      0
    );
    
    const veiculosIndisponiveis = ordensServico.filter(os => {
      if (os.tipoVeiculo !== tipoVeiculo) return false;
      
      // Verificar se a OS está em status que causa indisponibilidade
      // Apenas "Aberta" e "Concluída" causam indisponibilidade
      // OSs "Cancelada" são ignoradas completamente
      const statusIndisponivel = ['Aberta', 'Concluída'].includes(os.status);
      if (!statusIndisponivel) return false;

      // Criar data/hora de abertura em fuso horário local
      const [diaAbertura, mesAbertura, anoAbertura] = os.dataAbertura.split('-');
      const [horaAbertura, minutoAbertura] = os.horaAbertura.split(':');
      const dataAbertura = new Date(
        parseInt(anoAbertura),
        parseInt(mesAbertura) - 1,
        parseInt(diaAbertura),
        parseInt(horaAbertura),
        parseInt(minutoAbertura)
      );

      // Se a OS ainda está aberta, verificar se a hora de análise está após a abertura
      if (os.status === 'Aberta' && !os.dataFechamento) {
        return dataHoraAnalise >= dataAbertura;
      }

      // Se a OS foi concluída, verificar se a hora de análise está no período de indisponibilidade
      if (os.status === 'Concluída' && os.dataFechamento && os.horaFechamento) {
        const [diaFechamento, mesFechamento, anoFechamento] = os.dataFechamento.split('-');
        const [horaFechamento, minutoFechamento] = os.horaFechamento.split(':');
        const dataFechamento = new Date(
          parseInt(anoFechamento),
          parseInt(mesFechamento) - 1,
          parseInt(diaFechamento),
          parseInt(horaFechamento),
          parseInt(minutoFechamento)
        );

        return dataHoraAnalise >= dataAbertura && dataHoraAnalise <= dataFechamento;
      }

      // Se chegou aqui, a OS não causa indisponibilidade nesta hora
      return false;
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

  // Calcular média apenas das horas válidas (passadas)
  const horasValidas = disponibilidadePorHora.length;
  const mediaDisponibilidade = horasValidas > 0 ? 
    disponibilidadePorHora.reduce((acc, curr) => acc + curr.percentualDisponibilidade, 0) / horasValidas : 100;
  const mediaVeiculosDisponiveis = horasValidas > 0 ?
    disponibilidadePorHora.reduce((acc, curr) => acc + curr.totalDisponiveis, 0) / horasValidas : totalFrota;

  return {
    totalFrota,
    disponibilidadePorHora,
    mediaDisponibilidade,
    mediaVeiculosDisponiveis,
    isTempoReal: isHoje,
    horaAtual: isHoje ? hoje.getHours() : undefined
  };
}

export function calcularEstatisticasOS(ordensServico: OrdemServico[]): any {
  const totalOS = ordensServico.length;
  const osAbertas = ordensServico.filter(os => os.status === 'Aberta').length;
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
    osEmAndamento: 0, // Removido mas mantendo para compatibilidade
    osAguardandoPeca: 0, // Removido mas mantendo para compatibilidade
    osConcluidas,
    osCanceladas,
    tempoMedioResolucao
  };
}
