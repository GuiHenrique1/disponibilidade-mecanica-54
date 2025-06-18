import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CavaloMecanico, Composicao, Motorista, OrdemServico } from '@/types';
import { crudService } from '@/services/crudService';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  // Data
  cavalos: CavaloMecanico[];
  composicoes: Composicao[];
  motoristas: Motorista[];
  ordensServico: OrdemServico[];
  
  // Loading states
  loading: {
    cavalos: boolean;
    composicoes: boolean;
    motoristas: boolean;
    ordensServico: boolean;
  };
  
  // Actions
  refreshData: () => void;
  addCavalo: (cavalo: Omit<CavaloMecanico, 'id' | 'createdAt'>) => Promise<boolean>;
  updateCavalo: (id: string, updates: Partial<CavaloMecanico>) => Promise<boolean>;
  deleteCavalo: (id: string) => Promise<boolean>;
  
  addComposicao: (composicao: Omit<Composicao, 'id' | 'createdAt'>) => Promise<boolean>;
  updateComposicao: (id: string, updates: Partial<Composicao>) => Promise<boolean>;
  deleteComposicao: (id: string) => Promise<boolean>;
  
  addMotorista: (motorista: Omit<Motorista, 'id' | 'createdAt'>) => Promise<boolean>;
  updateMotorista: (id: string, updates: Partial<Motorista>) => Promise<boolean>;
  deleteMotorista: (id: string) => Promise<boolean>;
  
  addOrdemServico: (os: Omit<OrdemServico, 'id' | 'createdAt'>) => Promise<boolean>;
  updateOrdemServico: (id: string, updates: Partial<OrdemServico>) => Promise<boolean>;
  deleteOrdemServico: (id: string) => Promise<boolean>;
  
  // Bulk operations
  importCavalosEmMassa: (textData: string) => Promise<{ success: number; errors: string[] }>;
  importComposicoesEmMassa: (textData: string) => Promise<{ success: number; errors: string[] }>;
  importMotoristasEmMassa: (textData: string) => Promise<{ success: number; errors: string[] }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cavalos, setCavalos] = useState<CavaloMecanico[]>([]);
  const [composicoes, setComposicoes] = useState<Composicao[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  
  const [loading, setLoading] = useState({
    cavalos: false,
    composicoes: false,
    motoristas: false,
    ordensServico: false
  });
  
  const { toast } = useToast();

  const refreshData = useCallback(() => {
    try {
      console.log('AppContext - Atualizando dados...');
      setCavalos(crudService.getCavalos());
      setComposicoes(crudService.getComposicoes());
      setMotoristas(crudService.getMotoristas());
      setOrdensServico(crudService.getOrdensServico());
      console.log('AppContext - Dados atualizados com sucesso');
    } catch (error) {
      console.error('AppContext - Erro ao atualizar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh a cada 5 segundos para manter dados sempre atualizados
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Generic error handler
  const handleOperation = async <T,>(
    operation: () => T,
    loadingKey: keyof typeof loading,
    successMessage: string,
    errorMessage: string
  ): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      operation();
      // Forçar atualização imediata após operação
      setTimeout(() => {
        refreshData();
      }, 100);
      toast({
        title: "Sucesso",
        description: successMessage
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Cavalos Mecânicos
  const addCavalo = async (cavalo: Omit<CavaloMecanico, 'id' | 'createdAt'>): Promise<boolean> => {
    return handleOperation(
      () => crudService.addCavalo(cavalo),
      'cavalos',
      'Cavalo mecânico adicionado com sucesso',
      'Erro ao adicionar cavalo mecânico'
    );
  };

  const updateCavalo = async (id: string, updates: Partial<CavaloMecanico>): Promise<boolean> => {
    return handleOperation(
      () => crudService.updateCavalo(id, updates),
      'cavalos',
      'Cavalo mecânico atualizado com sucesso',
      'Erro ao atualizar cavalo mecânico'
    );
  };

  const deleteCavalo = async (id: string): Promise<boolean> => {
    return handleOperation(
      () => crudService.deleteCavalo(id),
      'cavalos',
      'Cavalo mecânico removido com sucesso',
      'Erro ao remover cavalo mecânico'
    );
  };

  // Composições
  const addComposicao = async (composicao: Omit<Composicao, 'id' | 'createdAt'>): Promise<boolean> => {
    return handleOperation(
      () => crudService.addComposicao(composicao),
      'composicoes',
      'Composição adicionada com sucesso',
      'Erro ao adicionar composição'
    );
  };

  const updateComposicao = async (id: string, updates: Partial<Composicao>): Promise<boolean> => {
    return handleOperation(
      () => crudService.updateComposicao(id, updates),
      'composicoes',
      'Composição atualizada com sucesso',
      'Erro ao atualizar composição'
    );
  };

  const deleteComposicao = async (id: string): Promise<boolean> => {
    return handleOperation(
      () => crudService.deleteComposicao(id),
      'composicoes',
      'Composição removida com sucesso',
      'Erro ao remover composição'
    );
  };

  // Motoristas
  const addMotorista = async (motorista: Omit<Motorista, 'id' | 'createdAt'>): Promise<boolean> => {
    return handleOperation(
      () => crudService.addMotorista(motorista),
      'motoristas',
      'Motorista adicionado com sucesso',
      'Erro ao adicionar motorista'
    );
  };

  const updateMotorista = async (id: string, updates: Partial<Motorista>): Promise<boolean> => {
    return handleOperation(
      () => crudService.updateMotorista(id, updates),
      'motoristas',
      'Motorista atualizado com sucesso',
      'Erro ao atualizar motorista'
    );
  };

  const deleteMotorista = async (id: string): Promise<boolean> => {
    return handleOperation(
      () => crudService.deleteMotorista(id),
      'motoristas',
      'Motorista removido com sucesso',
      'Erro ao remover motorista'
    );
  };

  // Ordens de Serviço
  const addOrdemServico = async (os: Omit<OrdemServico, 'id' | 'createdAt'>): Promise<boolean> => {
    return handleOperation(
      () => crudService.addOrdemServico(os),
      'ordensServico',
      'Ordem de serviço criada com sucesso',
      'Erro ao criar ordem de serviço'
    );
  };

  const updateOrdemServico = async (id: string, updates: Partial<OrdemServico>): Promise<boolean> => {
    return handleOperation(
      () => crudService.updateOrdemServico(id, updates),
      'ordensServico',
      'Ordem de serviço atualizada com sucesso',
      'Erro ao atualizar ordem de serviço'
    );
  };

  const deleteOrdemServico = async (id: string): Promise<boolean> => {
    return handleOperation(
      () => crudService.deleteOrdemServico(id),
      'ordensServico',
      'Ordem de serviço removida com sucesso',
      'Erro ao remover ordem de serviço'
    );
  };

  // Bulk operations
  const importCavalosEmMassa = async (textData: string): Promise<{ success: number; errors: string[] }> => {
    try {
      setLoading(prev => ({ ...prev, cavalos: true }));
      const result = crudService.importCavalosEmMassa(textData);
      refreshData();
      if (result.success > 0) {
        toast({
          title: "Sucesso",
          description: `${result.success} cavalos importados com sucesso`
        });
      }
      return result;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao importar cavalos",
        variant: "destructive"
      });
      return { success: 0, errors: [error instanceof Error ? error.message : 'Erro desconhecido'] };
    } finally {
      setLoading(prev => ({ ...prev, cavalos: false }));
    }
  };

  const importComposicoesEmMassa = async (textData: string): Promise<{ success: number; errors: string[] }> => {
    try {
      setLoading(prev => ({ ...prev, composicoes: true }));
      const result = crudService.importComposicoesEmMassa(textData);
      refreshData();
      if (result.success > 0) {
        toast({
          title: "Sucesso",
          description: `${result.success} composições importadas com sucesso`
        });
      }
      return result;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao importar composições",
        variant: "destructive"
      });
      return { success: 0, errors: [error instanceof Error ? error.message : 'Erro desconhecido'] };
    } finally {
      setLoading(prev => ({ ...prev, composicoes: false }));
    }
  };

  const importMotoristasEmMassa = async (textData: string): Promise<{ success: number; errors: string[] }> => {
    try {
      setLoading(prev => ({ ...prev, motoristas: true }));
      const result = crudService.importMotoristasEmMassa(textData);
      refreshData();
      if (result.success > 0) {
        toast({
          title: "Sucesso",
          description: `${result.success} motoristas importados com sucesso`
        });
      }
      return result;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao importar motoristas",
        variant: "destructive"
      });
      return { success: 0, errors: [error instanceof Error ? error.message : 'Erro desconhecido'] };
    } finally {
      setLoading(prev => ({ ...prev, motoristas: false }));
    }
  };

  const value: AppContextType = {
    cavalos,
    composicoes,
    motoristas,
    ordensServico,
    loading,
    refreshData,
    addCavalo,
    updateCavalo,
    deleteCavalo,
    addComposicao,
    updateComposicao,
    deleteComposicao,
    addMotorista,
    updateMotorista,
    deleteMotorista,
    addOrdemServico,
    updateOrdemServico,
    deleteOrdemServico,
    importCavalosEmMassa,
    importComposicoesEmMassa,
    importMotoristasEmMassa
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
