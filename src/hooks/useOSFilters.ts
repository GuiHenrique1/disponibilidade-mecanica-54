
import { useState, useMemo } from 'react';
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';

export const useOSFilters = (
  ordensServico: OrdemServico[],
  cavalos: CavaloMecanico[],
  composicoes: Composicao[]
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [veiculoFilter, setVeiculoFilter] = useState<string>('all');

  const getVeiculoLabel = (veiculoId: string, tipoVeiculo: 'frota' | 'composicao') => {
    if (tipoVeiculo === 'frota') {
      const cavalo = cavalos.find(c => c.id === veiculoId);
      return cavalo ? cavalo.nomeFreota : '';
    } else {
      const composicao = composicoes.find(c => c.id === veiculoId);
      return composicao ? composicao.identificador : '';
    }
  };

  const filteredAndSortedOS = useMemo(() => {
    let filtered = ordensServico.filter(os => {
      // Filtro de pesquisa
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        os.id.toLowerCase().includes(searchLower) ||
        os.descricaoServico?.toLowerCase().includes(searchLower) ||
        os.placaReferente.toLowerCase().includes(searchLower) ||
        os.tipoManutencao.toLowerCase().includes(searchLower) ||
        getVeiculoLabel(os.veiculoId, os.tipoVeiculo).toLowerCase().includes(searchLower);

      // Filtro de status
      const matchesStatus = statusFilter === 'all' || os.status === statusFilter;

      // Filtro de tipo de manutenção
      const matchesTipo = tipoFilter === 'all' || os.tipoManutencao === tipoFilter;

      // Filtro de veículo
      const matchesVeiculo = veiculoFilter === 'all' || 
        (veiculoFilter === 'frota' && os.tipoVeiculo === 'frota') ||
        (veiculoFilter === 'composicao' && os.tipoVeiculo === 'composicao');

      return matchesSearch && matchesStatus && matchesTipo && matchesVeiculo;
    });

    // Ordenação: OSs mais recentes no topo, concluídas no final
    return filtered.sort((a, b) => {
      // Primeiro, separar por status: Concluídas vão para o final
      if (a.status === 'Concluída' && b.status !== 'Concluída') return 1;
      if (b.status === 'Concluída' && a.status !== 'Concluída') return -1;

      // Se ambas têm o mesmo status, ordenar por data/hora de criação (mais recente primeiro)
      const dateA = new Date(`${a.dataAbertura.split('-').reverse().join('-')}T${a.horaAbertura}`);
      const dateB = new Date(`${b.dataAbertura.split('-').reverse().join('-')}T${b.horaAbertura}`);
      
      return dateB.getTime() - dateA.getTime();
    });
  }, [ordensServico, searchTerm, statusFilter, tipoFilter, veiculoFilter, cavalos, composicoes]);

  const openOrdersCount = ordensServico.filter(os => os.status === 'Aberta').length;

  return {
    filteredAndSortedOS,
    openOrdersCount,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    tipoFilter,
    setTipoFilter,
    veiculoFilter,
    setVeiculoFilter
  };
};
