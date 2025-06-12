
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CavaloMecanico } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CavalosMecanicos: React.FC = () => {
  const [cavalos, setCavalos] = useLocalStorage<CavaloMecanico[]>('cavalos-mecanicos', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [newCavaloPlaca, setNewCavaloPlaca] = useState('');
  const [editingCavalo, setEditingCavalo] = useState<CavaloMecanico | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredCavalos = cavalos.filter(cavalo =>
    cavalo.placa.toLowerCase().includes(searchTerm.toLowerCase())
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
    const novosCavalos: CavaloMecanico[] = [];

    linhas.forEach(linha => {
      const placa = linha.trim();
      if (placa && !cavalos.some(c => c.placa === placa)) {
        novosCavalos.push({
          id: crypto.randomUUID(),
          placa,
          createdAt: new Date()
        });
      }
    });

    setCavalos([...cavalos, ...novosCavalos]);
    setImportText('');
    
    toast({
      title: "Sucesso",
      description: `${novosCavalos.length} cavalos mecânicos importados com sucesso.`
    });
  };

  const handleAddCavalo = () => {
    if (!newCavaloPlaca.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma placa.",
        variant: "destructive"
      });
      return;
    }

    if (cavalos.some(c => c.placa === newCavaloPlaca.trim())) {
      toast({
        title: "Erro",
        description: "Cavalo com esta placa já existe.",
        variant: "destructive"
      });
      return;
    }

    const novoCavalo: CavaloMecanico = {
      id: crypto.randomUUID(),
      placa: newCavaloPlaca.trim(),
      createdAt: new Date()
    };

    setCavalos([...cavalos, novoCavalo]);
    setNewCavaloPlaca('');
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Cavalo mecânico adicionado com sucesso."
    });
  };

  const handleEditCavalo = (cavalo: CavaloMecanico) => {
    if (!newCavaloPlaca.trim()) return;

    const updatedCavalos = cavalos.map(c =>
      c.id === cavalo.id ? { ...c, placa: newCavaloPlaca.trim() } : c
    );

    setCavalos(updatedCavalos);
    setEditingCavalo(null);
    setNewCavaloPlaca('');
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Cavalo mecânico atualizado com sucesso."
    });
  };

  const handleDeleteCavalo = (id: string) => {
    setCavalos(cavalos.filter(c => c.id !== id));
    toast({
      title: "Sucesso",
      description: "Cavalo mecânico removido com sucesso."
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Cavalos Mecânicos</h1>
        
        {/* Card Total */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Total de Cavalos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{cavalos.length}</div>
          </CardContent>
        </Card>

        {/* Importação em Massa */}
        <Card>
          <CardHeader>
            <CardTitle>Importação em Massa - Cavalos Mecânicos</CardTitle>
            <CardDescription>
              Cole as placas dos cavalos mecânicos, uma por linha (ex: T2506 SYL4A24)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="T2506 SYL4A24&#10;T2556 SYDSG46&#10;..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[120px]"
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
              placeholder="Buscar por frota ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCavalo(null);
                setNewCavaloPlaca('');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cavalo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCavalo ? 'Editar Cavalo Mecânico' : 'Adicionar Cavalo Mecânico'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    value={newCavaloPlaca}
                    onChange={(e) => setNewCavaloPlaca(e.target.value)}
                    placeholder="Ex: T2506 SYL4A24"
                  />
                </div>
                <Button 
                  onClick={editingCavalo ? () => handleEditCavalo(editingCavalo) : handleAddCavalo}
                  className="w-full"
                >
                  {editingCavalo ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Cavalos */}
        <Card>
          <CardHeader>
            <CardTitle>Cavalos Cadastrados ({filteredCavalos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCavalos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum cavalo mecânico encontrado.
                </p>
              ) : (
                filteredCavalos.map((cavalo) => (
                  <div key={cavalo.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{cavalo.placa}</p>
                      <p className="text-sm text-muted-foreground">
                        Cadastrado em: {new Date(cavalo.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCavalo(cavalo);
                          setNewCavaloPlaca(cavalo.placa);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCavalo(cavalo.id)}
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
