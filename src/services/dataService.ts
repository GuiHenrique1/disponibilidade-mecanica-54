
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

  // Método para importação em massa de cavalos
  importCavalosEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    const cavalos = this.getCavalos();
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const nomeFreota = parts[0];
        const placa = parts[1];
        
        // Verificar se já existe
        const exists = cavalos.some(c => c.nomeFreota === nomeFreota || c.placa === placa);
        if (!exists) {
          this.addCavalo({ nomeFreota, placa });
          success++;
        } else {
          errors.push(`Cavalo ${nomeFreota} ${placa} já existe`);
        }
      } else {
        errors.push(`Linha inválida: ${line}`);
      }
    }

    return { success, errors };
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

  // Método para importação em massa de composições
  importComposicoesEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    const composicoes = this.getComposicoes();
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const identificador = parts[0];
        const placas = parts.slice(1);
        
        // Verificar se já existe
        const exists = composicoes.some(c => c.identificador === identificador);
        if (!exists) {
          this.addComposicao({ identificador, placas });
          success++;
        } else {
          errors.push(`Composição ${identificador} já existe`);
        }
      } else {
        errors.push(`Linha inválida: ${line}`);
      }
    }

    return { success, errors };
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

  // Método para importação em massa de motoristas
  importMotoristasEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    const motoristas = this.getMotoristas();
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      const nome = line.trim();
      if (nome) {
        // Verificar se já existe
        const exists = motoristas.some(m => m.nome.toLowerCase() === nome.toLowerCase());
        if (!exists) {
          this.addMotorista({ nome });
          success++;
        } else {
          errors.push(`Motorista ${nome} já existe`);
        }
      }
    }

    return { success, errors };
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

  // Método para criar OS Stand-by automaticamente
  criarOSStandBy(composicaoId: string, osOriginal: Omit<OrdemServico, 'id' | 'createdAt'>): OrdemServico | null {
    const cavalos = this.getCavalos();
    const composicoes = this.getComposicoes();
    
    const composicao = composicoes.find(c => c.id === composicaoId);
    if (!composicao || !composicao.placas.length) return null;

    // Buscar o primeiro cavalo que tenha uma das placas da composição
    const primeiraPlaca = composicao.placas[0];
    const cavaloStandBy = cavalos.find(c => c.placa === primeiraPlaca);
    
    if (!cavaloStandBy) return null;

    const osStandBy: Omit<OrdemServico, 'id' | 'createdAt'> = {
      ...osOriginal,
      tipoVeiculo: 'frota',
      veiculoId: cavaloStandBy.id,
      placaReferente: cavaloStandBy.placa,
      descricaoServico: `STAND-BY ${composicao.identificador} - ${osOriginal.descricaoServico}`,
      isStandBy: true,
      composicaoOrigemId: composicaoId
    };

    return this.addOrdemServico(osStandBy);
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
  getOSByVeiculo(veiculoId: string, tipoVeiculo: 'frota' | 'composicao'): OrdemServico[] {
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
