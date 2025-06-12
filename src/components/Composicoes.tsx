import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Composicao } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Composicoes: React.FC = () => {
  const [composicoes, setComposicoes] = useLocalStorage<Composicao[]>('composicoes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [newComposicaoId, setNewComposicaoId] = useState('');
  const [primeiraComposicao, setPrimeiraComposicao] = useState('');
  const [segundaComposicao, setSegundaComposicao] = useState('');
  const [editingComposicao, setEditingComposicao] = useState<Composicao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredComposicoes = composicoes.filter(composicao =>
    composicao.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    composicao.placas.some(placa => placa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImportData = () => {
    if (!importText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira dados para importar.",
        variant: "destructive"
      });
      return;
    }

    const linhas = importText.split('\n').filter(linha => linha.trim());
    const novasComposicoes: Composicao[] = [];

    linhas.forEach(linha => {
      const partes = linha.includes('\t') 
        ? linha.trim().split('\t').filter(p => p.trim())
        : linha.trim().split(/\s+/).filter(p => p.trim());
      
      if (partes.length >= 2) {
        const identificador = partes[0].trim();
        const placas = partes.slice(1).map(p => p.trim()).filter(p => p);

        if (identificador && placas.length > 0 && !composicoes.some(c => c.identificador === identificador)) {
          novasComposicoes.push({
            id: crypto.randomUUID(),
            identificador,
            placas,
            createdAt: new Date()
          });
        }
      }
    });

    setComposicoes([...composicoes, ...novasComposicoes]);
    setImportText('');
    
    toast({
      title: "Sucesso",
      description: `${novasComposicoes.length} composições importadas com sucesso.`
    });
  };

  const handleAddComposicao = () => {
    if (!newComposicaoId.trim() || !primeiraComposicao.trim() || !segundaComposicao.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (composicoes.some(c => c.identificador === newComposicaoId.trim())) {
      toast({
        title: "Erro",
        description: "Composição com este identificador já existe.",
        variant: "destructive"
      });
      return;
    }

    const placas = [primeiraComposicao.trim(), segundaComposicao.trim()];
    
    const novaComposicao: Composicao = {
      id: crypto.randomUUID(),
      identificador: newComposicaoId.trim(),
      placas,
      createdAt: new Date()
    };

    setComposicoes([...composicoes, novaComposicao]);
    setNewComposicaoId('');
    setPrimeiraComposicao('');
    setSegundaComposicao('');
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Composição adicionada com sucesso."
    });
  };

  const handleEditComposicao = (composicao: Composicao) => {
    if (!newComposicaoId.trim() || !primeiraComposicao.trim() || !segundaComposicao.trim()) return;

    const placas = [primeiraComposicao.trim(), segundaComposicao.trim()];
    
    const updatedComposicoes = composicoes.map(c =>
      c.id === composicao.id ? { 
        ...c, 
        identificador: newComposicaoId.trim(),
        placas 
      } : c
    );

    setComposicoes(updatedComposicoes);
    setEditingComposicao(null);
    setNewComposicaoId('');
    setPrimeiraComposicao('');
    setSegundaComposicao('');
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Composição atualizada com sucesso."
    });
  };

  const handleDeleteComposicao = (id: string) => {
    setComposicoes(composicoes.filter(c => c.id !== id));
    toast({
      title: "Sucesso",
      description: "Composição removida com sucesso."
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Composições</h1>
        
        {/* Card Total */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Total de Composições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{composicoes.length}</div>
          </CardContent>
        </Card>

        {/* Importação em Massa */}
        <Card>
          <CardHeader>
            <CardTitle>Importação em Massa - Composições</CardTitle>
            <CardDescription>
              Cole as composições no formato: C01	QAH0J25	QAH0J27 (separados por tabs ou espaços)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="C01	QAH0J25	QAH0J27&#10;C02	QAH0J01	QAH0J17&#10;C03	QAH0953	QAH0955&#10;..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[120px] font-mono"
            />
            <div className="flex space-x-2">
              <Button onClick={handleImportData} className="bg-primary hover:bg-primary/90">
                Importar Dados
              </Button>
              <Button variant="outline" onClick={() => setImportText('')}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Busca e Adicionar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por composição ou placas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingComposicao(null);
                setNewComposicaoId('');
                setPrimeiraComposicao('');
                setSegundaComposicao('');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Composição
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingComposicao ? 'Editar Composição' : 'Adicionar Composição'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="identificador">Composição</Label>
                  <Input
                    id="identificador"
                    value={newComposicaoId}
                    onChange={(e) => setNewComposicaoId(e.target.value)}
                    placeholder="Ex: C01"
                  />
                </div>
                <div>
                  <Label htmlFor="primeira">1ª Composição</Label>
                  <Input
                    id="primeira"
                    value={primeiraComposicao}
                    onChange={(e) => setPrimeiraComposicao(e.target.value)}
                    placeholder="Ex: QAH0J25"
                  />
                </div>
                <div>
                  <Label htmlFor="segunda">2ª Composição</Label>
                  <Input
                    id="segunda"
                    value={segundaComposicao}
                    onChange={(e) => setSegundaComposicao(e.target.value)}
                    placeholder="Ex: QAH0J27"
                  />
                </div>
                <Button 
                  onClick={editingComposicao ? () => handleEditComposicao(editingComposicao) : handleAddComposicao}
                  className="w-full"
                >
                  {editingComposicao ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Composições */}
        <Card>
          <CardHeader>
            <CardTitle>Composições Cadastradas ({filteredComposicoes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredComposicoes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma composição encontrada.
                </p>
              ) : (
                filteredComposicoes.map((composicao) => (
                  <div key={composicao.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{composicao.identificador}</p>
                      <p className="text-sm text-muted-foreground">
                        Placas: {composicao.placas.join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cadastrado em: {new Date(composicao.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingComposicao(composicao);
                          setNewComposicaoId(composicao.identificador);
                          setPrimeiraComposicao(composicao.placas[0] || '');
                          setSegundaComposicao(composicao.placas[1] || '');
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComposicao(composicao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
