
import { CavaloMecanico, Composicao, Motorista, OrdemServico } from '@/types';

class DataService {
  // Cavalos Mecânicos
  getCavalos(): CavaloMecanico[] {
    const data = localStorage.getItem('cavalos-mecanicos');
    return data ? JSON.parse(data) : [];
  }

  saveCavalos(cavalos: CavaloMecanico[]): void {
    localStorage.setItem('cavalos-mecanicos', JSON.stringify(cavalos));
  }

  addCavalo(cavalo: Omit<CavaloMecanico, 'id' | 'createdAt'>): CavaloMecanico {
    const cavalos = this.getCavalos();
    const novoCavalo: CavaloMecanico = {
      ...cavalo,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedCavalos = [...cavalos, novoCavalo];
    this.saveCavalos(updatedCavalos);
    return novoCavalo;
  }

  updateCavalo(id: string, updates: Partial<CavaloMecanico>): boolean {
    const cavalos = this.getCavalos();
    const index = cavalos.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    cavalos[index] = { ...cavalos[index], ...updates };
    this.saveCavalos(cavalos);
    return true;
  }

  deleteCavalo(id: string): boolean {
    const cavalos = this.getCavalos();
    const filtered = cavalos.filter(c => c.id !== id);
    
    if (filtered.length === cavalos.length) return false;
    
    this.saveCavalos(filtered);
    return true;
  }

  // Composições
  getComposicoes(): Composicao[] {
    const data = localStorage.getItem('composicoes');
    return data ? JSON.parse(data) : [];
  }

  saveComposicoes(composicoes: Composicao[]): void {
    localStorage.setItem('composicoes', JSON.stringify(composicoes));
  }

  addComposicao(composicao: Omit<Composicao, 'id' | 'createdAt'>): Composicao {
    const composicoes = this.getComposicoes();
    const novaComposicao: Composicao = {
      ...composicao,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedComposicoes = [...composicoes, novaComposicao];
    this.saveComposicoes(updatedComposicoes);
    return novaComposicao;
  }

  updateComposicao(id: string, updates: Partial<Composicao>): boolean {
    const composicoes = this.getComposicoes();
    const index = composicoes.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    composicoes[index] = { ...composicoes[index], ...updates };
    this.saveComposicoes(composicoes);
    return true;
  }

  deleteComposicao(id: string): boolean {
    const composicoes = this.getComposicoes();
    const filtered = composicoes.filter(c => c.id !== id);
    
    if (filtered.length === composicoes.length) return false;
    
    this.saveComposicoes(filtered);
    return true;
  }

  // Motoristas
  getMotoristas(): Motorista[] {
    const data = localStorage.getItem('motoristas');
    return data ? JSON.parse(data) : [];
  }

  saveMotoristas(motoristas: Motorista[]): void {
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
  }

  addMotorista(motorista: Omit<Motorista, 'id' | 'createdAt'>): Motorista {
    const motoristas = this.getMotoristas();
    const novoMotorista: Motorista = {
      ...motorista,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedMotoristas = [...motoristas, novoMotorista];
    this.saveMotoristas(updatedMotoristas);
    return novoMotorista;
  }

  updateMotorista(id: string, updates: Partial<Motorista>): boolean {
    const motoristas = this.getMotoristas();
    const index = motoristas.findIndex(m => m.id === id);
    
    if (index === -1) return false;
    
    motoristas[index] = { ...motoristas[index], ...updates };
    this.saveMotoristas(motoristas);
    return true;
  }

  deleteMotorista(id: string): boolean {
    const motoristas = this.getMotoristas();
    const filtered = motoristas.filter(m => m.id !== id);
    
    if (filtered.length === motoristas.length) return false;
    
    this.saveMotoristas(filtered);
    return true;
  }

  // Ordens de Serviço
  getOrdensServico(): OrdemServico[] {
    const data = localStorage.getItem('ordens-servico');
    return data ? JSON.parse(data) : [];
  }

  saveOrdensServico(ordensServico: OrdemServico[]): void {
    localStorage.setItem('ordens-servico', JSON.stringify(ordensServico));
  }

  addOrdemServico(os: Omit<OrdemServico, 'id' | 'createdAt'>): OrdemServico {
    const ordensServico = this.getOrdensServico();
    const novaOS: OrdemServico = {
      ...os,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedOS = [...ordensServico, novaOS];
    this.saveOrdensServico(updatedOS);
    return novaOS;
  }

  updateOrdemServico(id: string, updates: Partial<OrdemServico>): boolean {
    const ordensServico = this.getOrdensServico();
    const index = ordensServico.findIndex(os => os.id === id);
    
    if (index === -1) return false;
    
    ordensServico[index] = { ...ordensServico[index], ...updates };
    this.saveOrdensServico(ordensServico);
    return true;
  }

  deleteOrdemServico(id: string): boolean {
    const ordensServico = this.getOrdensServico();
    const filtered = ordensServico.filter(os => os.id !== id);
    
    if (filtered.length === ordensServico.length) return false;
    
    this.saveOrdensServico(filtered);
    return true;
  }

  // Métodos de busca e relatórios
  getOSByVeiculo(veiculoId: string, tipoVeiculo: 'cavalo' | 'composicao'): OrdemServico[] {
    const ordensServico = this.getOrdensServico();
    return ordensServico.filter(os => os.veiculoId === veiculoId && os.tipoVeiculo === tipoVeiculo);
  }

  getOSAbertas(): OrdemServico[] {
    const ordensServico = this.getOrdensServico();
    return ordensServico.filter(os => ['Aberta', 'Em Andamento', 'Aguardando Peça'].includes(os.status));
  }

  exportData(): string {
    const data = {
      cavalos: this.getCavalos(),
      composicoes: this.getComposicoes(),
      motoristas: this.getMotoristas(),
      ordensServico: this.getOrdensServico(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.cavalos) this.saveCavalos(data.cavalos);
      if (data.composicoes) this.saveComposicoes(data.composicoes);
      if (data.motoristas) this.saveMotoristas(data.motoristas);
      if (data.ordensServico) this.saveOrdensServico(data.ordensServico);
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}

export const dataService = new DataService();
