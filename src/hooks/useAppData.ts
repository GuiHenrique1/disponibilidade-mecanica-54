
import { useAppContext } from '@/contexts/AppContext';

export const useAppData = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useAppData deve ser usado dentro de um AppProvider');
  }
  
  return context;
};
