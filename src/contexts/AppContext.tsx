
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CavaloMecanico, Composicao, Motorista, OrdemServico } from '@/types';
import { dataService } from '@/services/dataService';
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

  const refreshData = () => {
    try {
      setCavalos(dataService.getCavalos());
      setComposicoes(dataService.getComposicoes());
      setMotoristas(dataService.getMotoristas());
      setOrdensServico(dataService.getOrdensServico());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Cavalos Mecânicos
  const addCavalo = async (cavalo: Omit<CavaloMecanico, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, cavalos: true }));
      dataService.addCavalo(cavalo);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Cavalo mecânico adicionado com sucesso"
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar cavalo mecânico",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, cavalos: false }));
    }
  };

  const updateCavalo = async (id: string, updates: Partial<CavaloMecanico>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, cavalos: true }));
      const success = dataService.updateCavalo(id, updates);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Cavalo mecânico atualizado com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cavalo mecânico",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, cavalos: false }));
    }
  };

  const deleteCavalo = async (id: string): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, cavalos: true }));
      const success = dataService.deleteCavalo(id);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Cavalo mecânico removido com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover cavalo mecânico",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, cavalos: false }));
    }
  };

  // Composições (similar pattern)
  const addComposicao = async (composicao: Omit<Composicao, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, composicoes: true }));
      dataService.addComposicao(composicao);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Composição adicionada com sucesso"
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar composição",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, composicoes: false }));
    }
  };

  const updateComposicao = async (id: string, updates: Partial<Composicao>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, composicoes: true }));
      const success = dataService.updateComposicao(id, updates);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Composição atualizada com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar composição",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, composicoes: false }));
    }
  };

  const deleteComposicao = async (id: string): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, composicoes: true }));
      const success = dataService.deleteComposicao(id);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Composição removida com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover composição",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, composicoes: false }));
    }
  };

  // Motoristas (similar pattern)
  const addMotorista = async (motorista: Omit<Motorista, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, motoristas: true }));
      dataService.addMotorista(motorista);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Motorista adicionado com sucesso"
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar motorista",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, motoristas: false }));
    }
  };

  const updateMotorista = async (id: string, updates: Partial<Motorista>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, motoristas: true }));
      const success = dataService.updateMotorista(id, updates);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Motorista atualizado com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar motorista",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, motoristas: false }));
    }
  };

  const deleteMotorista = async (id: string): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, motoristas: true }));
      const success = dataService.deleteMotorista(id);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Motorista removido com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover motorista",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, motoristas: false }));
    }
  };

  // Ordens de Serviço (similar pattern)
  const addOrdemServico = async (os: Omit<OrdemServico, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, ordensServico: true }));
      dataService.addOrdemServico(os);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Ordem de serviço criada com sucesso"
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar ordem de serviço",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, ordensServico: false }));
    }
  };

  const updateOrdemServico = async (id: string, updates: Partial<OrdemServico>): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, ordensServico: true }));
      const success = dataService.updateOrdemServico(id, updates);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Ordem de serviço atualizada com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem de serviço",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, ordensServico: false }));
    }
  };

  const deleteOrdemServico = async (id: string): Promise<boolean> => {
    try {
      setLoading(prev => ({ ...prev, ordensServico: true }));
      const success = dataService.deleteOrdemServico(id);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Ordem de serviço removida com sucesso"
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover ordem de serviço",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, ordensServico: false }));
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
    deleteOrdemServico
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
