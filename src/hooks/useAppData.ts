
import { useAppContext } from '@/contexts/AppContext';

export const useAppData = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useAppData deve ser usado dentro de um AppProvider');
  }
  
  const { refreshData: originalRefreshData, ...rest } = context;
  
  // Adicionar tratamento de erro para refresh
  const refreshData = async () => {
    try {
      if (originalRefreshData) {
        await originalRefreshData();
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      // Aqui poderíamos adicionar um toast de erro se necessário
    }
  };
  
  return {
    ...rest,
    refreshData
  };
};
