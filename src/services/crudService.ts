
import { CavaloMecanico, Composicao, Motorista, OrdemServico } from '@/types';
import { validateCavalo, validateComposicao, validateMotorista, validateOrdemServico } from '@/utils/validation';

class CrudService {
  // Cavalos Mecânicos
  private getCavalosFromStorage(): CavaloMecanico[] {
    const data = localStorage.getItem('cavalos-mecanicos');
    return data ? JSON.parse(data) : [];
  }

  private saveCavalosToStorage(cavalos: CavaloMecanico[]): void {
    localStorage.setItem('cavalos-mecanicos', JSON.stringify(cavalos));
  }

  getCavalos(): CavaloMecanico[] {
    return this.getCavalosFromStorage();
  }

  addCavalo(cavalo: Omit<CavaloMecanico, 'id' | 'createdAt'>): CavaloMecanico {
    validateCavalo(cavalo);
    
    const cavalos = this.getCavalosFromStorage();
    
    // Verificar duplicatas
    const exists = cavalos.some(c => c.placa === cavalo.placa || c.nomeFreota === cavalo.nomeFreota);
    if (exists) {
      throw new Error('Cavalo com esta placa ou nome de frota já existe');
    }
    
    const novoCavalo: CavaloMecanico = {
      ...cavalo,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedCavalos = [...cavalos, novoCavalo];
    this.saveCavalosToStorage(updatedCavalos);
    return novoCavalo;
  }

  updateCavalo(id: string, updates: Partial<CavaloMecanico>): boolean {
    const cavalos = this.getCavalosFromStorage();
    const index = cavalos.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Cavalo não encontrado');
    }
    
    const updatedCavalo = { ...cavalos[index], ...updates };
    validateCavalo(updatedCavalo);
    
    cavalos[index] = updatedCavalo;
    this.saveCavalosToStorage(cavalos);
    return true;
  }

  deleteCavalo(id: string): boolean {
    const cavalos = this.getCavalosFromStorage();
    const filtered = cavalos.filter(c => c.id !== id);
    
    if (filtered.length === cavalos.length) {
      throw new Error('Cavalo não encontrado');
    }
    
    this.saveCavalosToStorage(filtered);
    return true;
  }

  // Composições
  private getComposicoesFromStorage(): Composicao[] {
    const data = localStorage.getItem('composicoes');
    return data ? JSON.parse(data) : [];
  }

  private saveComposicoesToStorage(composicoes: Composicao[]): void {
    localStorage.setItem('composicoes', JSON.stringify(composicoes));
  }

  getComposicoes(): Composicao[] {
    return this.getComposicoesFromStorage();
  }

  addComposicao(composicao: Omit<Composicao, 'id' | 'createdAt'>): Composicao {
    validateComposicao(composicao);
    
    const composicoes = this.getComposicoesFromStorage();
    
    // Verificar duplicatas
    const exists = composicoes.some(c => c.identificador === composicao.identificador);
    if (exists) {
      throw new Error('Composição com este identificador já existe');
    }
    
    const novaComposicao: Composicao = {
      ...composicao,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedComposicoes = [...composicoes, novaComposicao];
    this.saveComposicoesToStorage(updatedComposicoes);
    return novaComposicao;
  }

  updateComposicao(id: string, updates: Partial<Composicao>): boolean {
    const composicoes = this.getComposicoesFromStorage();
    const index = composicoes.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Composição não encontrada');
    }
    
    const updatedComposicao = { ...composicoes[index], ...updates };
    validateComposicao(updatedComposicao);
    
    composicoes[index] = updatedComposicao;
    this.saveComposicoesToStorage(composicoes);
    return true;
  }

  deleteComposicao(id: string): boolean {
    const composicoes = this.getComposicoesFromStorage();
    const filtered = composicoes.filter(c => c.id !== id);
    
    if (filtered.length === composicoes.length) {
      throw new Error('Composição não encontrada');
    }
    
    this.saveComposicoesToStorage(filtered);
    return true;
  }

  // Motoristas
  private getMotoristasFromStorage(): Motorista[] {
    const data = localStorage.getItem('motoristas');
    return data ? JSON.parse(data) : [];
  }

  private saveMotoristasToStorage(motoristas: Motorista[]): void {
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
  }

  getMotoristas(): Motorista[] {
    return this.getMotoristasFromStorage();
  }

  addMotorista(motorista: Omit<Motorista, 'id' | 'createdAt'>): Motorista {
    validateMotorista(motorista);
    
    const motoristas = this.getMotoristasFromStorage();
    
    // Verificar duplicatas
    const exists = motoristas.some(m => m.nome.toLowerCase() === motorista.nome.toLowerCase());
    if (exists) {
      throw new Error('Motorista com este nome já existe');
    }
    
    const novoMotorista: Motorista = {
      ...motorista,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedMotoristas = [...motoristas, novoMotorista];
    this.saveMotoristasToStorage(updatedMotoristas);
    return novoMotorista;
  }

  updateMotorista(id: string, updates: Partial<Motorista>): boolean {
    const motoristas = this.getMotoristasFromStorage();
    const index = motoristas.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error('Motorista não encontrado');
    }
    
    const updatedMotorista = { ...motoristas[index], ...updates };
    validateMotorista(updatedMotorista);
    
    motoristas[index] = updatedMotorista;
    this.saveMotoristasToStorage(motoristas);
    return true;
  }

  deleteMotorista(id: string): boolean {
    const motoristas = this.getMotoristasFromStorage();
    const filtered = motoristas.filter(m => m.id !== id);
    
    if (filtered.length === motoristas.length) {
      throw new Error('Motorista não encontrado');
    }
    
    this.saveMotoristasToStorage(filtered);
    return true;
  }

  // Ordens de Serviço
  private getOrdensServicoFromStorage(): OrdemServico[] {
    const data = localStorage.getItem('ordens-servico');
    return data ? JSON.parse(data) : [];
  }

  private saveOrdensServicoToStorage(ordensServico: OrdemServico[]): void {
    localStorage.setItem('ordens-servico', JSON.stringify(ordensServico));
  }

  getOrdensServico(): OrdemServico[] {
    return this.getOrdensServicoFromStorage();
  }

  addOrdemServico(os: Omit<OrdemServico, 'id' | 'createdAt'>): OrdemServico {
    validateOrdemServico(os);
    
    const ordensServico = this.getOrdensServicoFromStorage();
    
    // Verificar se já existe OS aberta para o mesmo veículo
    const osAberta = ordensServico.find(
      existingOS => existingOS.veiculoId === os.veiculoId && 
                   existingOS.tipoVeiculo === os.tipoVeiculo && 
                   existingOS.status === 'Aberta'
    );
    
    if (osAberta) {
      throw new Error('Já existe uma OS aberta para este veículo');
    }
    
    const novaOS: OrdemServico = {
      ...os,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedOS = [...ordensServico, novaOS];
    this.saveOrdensServicoToStorage(updatedOS);
    return novaOS;
  }

  updateOrdemServico(id: string, updates: Partial<OrdemServico>): boolean {
    const ordensServico = this.getOrdensServicoFromStorage();
    const index = ordensServico.findIndex(os => os.id === id);
    
    if (index === -1) {
      throw new Error('Ordem de serviço não encontrada');
    }
    
    const updatedOS = { ...ordensServico[index], ...updates };
    validateOrdemServico(updatedOS);
    
    ordensServico[index] = updatedOS;
    this.saveOrdensServicoToStorage(ordensServico);
    return true;
  }

  deleteOrdemServico(id: string): boolean {
    const ordensServico = this.getOrdensServicoFromStorage();
    const filtered = ordensServico.filter(os => os.id !== id);
    
    if (filtered.length === ordensServico.length) {
      throw new Error('Ordem de serviço não encontrada');
    }
    
    this.saveOrdensServicoToStorage(filtered);
    return true;
  }

  // Métodos de importação em massa
  importCavalosEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      try {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const nomeFreota = parts[0];
          const placa = parts[1];
          this.addCavalo({ nomeFreota, placa });
          success++;
        } else {
          errors.push(`Linha inválida: ${line}`);
        }
      } catch (error) {
        errors.push(`Erro na linha "${line}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return { success, errors };
  }

  importComposicoesEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      try {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const identificador = parts[0];
          const primeiraComposicao = parts[1];
          const segundaComposicao = parts[2];
          const placas = parts.slice(1);
          
          this.addComposicao({ 
            identificador, 
            placas,
            primeiraComposicao,
            segundaComposicao
          });
          success++;
        } else {
          errors.push(`Linha inválida: ${line}`);
        }
      } catch (error) {
        errors.push(`Erro na linha "${line}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return { success, errors };
  }

  importMotoristasEmMassa(textData: string): { success: number; errors: string[] } {
    const lines = textData.split('\n').filter(line => line.trim());
    let success = 0;
    const errors: string[] = [];

    for (const line of lines) {
      try {
        const nome = line.trim();
        if (nome) {
          this.addMotorista({ nome });
          success++;
        }
      } catch (error) {
        errors.push(`Erro na linha "${line}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return { success, errors };
  }
}

export const crudService = new CrudService();
