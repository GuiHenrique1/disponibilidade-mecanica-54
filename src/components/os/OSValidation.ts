
import { OrdemServico, CavaloMecanico, Composicao } from '@/types';

export const validateUniqueOS = (
  ordensServico: OrdemServico[],
  veiculoId: string,
  tipoVeiculo: 'frota' | 'composicao',
  cavalos: CavaloMecanico[],
  composicoes: Composicao[]
): string | null => {
  const osAbertas = ordensServico.filter(
    os => os.status === 'Aberta' && os.veiculoId === veiculoId && os.tipoVeiculo === tipoVeiculo
  );
  
  if (osAbertas.length > 0) {
    if (tipoVeiculo === 'frota') {
      const cavalo = cavalos.find(c => c.id === veiculoId);
      return `Já existe uma OS aberta para o veículo ${cavalo?.nomeFreota || 'não identificado'}`;
    } else {
      const composicao = composicoes.find(c => c.id === veiculoId);
      return `Já existe uma OS aberta para a composição ${composicao?.identificador || 'não identificada'}`;
    }
  }
  
  return null;
};
