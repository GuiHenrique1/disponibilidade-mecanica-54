
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CavaloMecanico } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CavalosMecanicos: React.FC = () => {
  const { cavalos, loading, addCavalo, updateCavalo, deleteCavalo, importCavalosEmMassa } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [newCavaloNomeFreota, setNewCavaloNomeFreota] = useState('');
  const [newCavaloPlaca, setNewCavaloPlaca] = useState('');
  const [editingCavalo, setEditingCavalo] = useState<CavaloMecanico | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredCavalos = cavalos.filter(cavalo =>
    cavalo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cavalo.nomeFreota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportData = async () => {
    if (!importText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira dados para importar.",
        variant: "destructive"
      });
      return;
    }

    const result = await importCavalosEmMassa(importText);
    
    if (result.errors.length > 0) {
      toast({
        title: "Importação com erros",
        description: `${result.success} importados, ${result.errors.length} erros`,
        variant: "destructive"
      });
    }
    
    setImportText('');
  };

  const handleAddCavalo = async () => {
    if (!newCavaloNomeFreota.trim() || !newCavaloPlaca.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome da frota e a placa.",
        variant: "destructive"
      });
      return;
    }

    const success = await addCavalo({
      nomeFreota: newCavaloNomeFreota.trim(),
      placa: newCavaloPlaca.trim()
    });

    if (success) {
      setNewCavaloNomeFreota('');
      setNewCavaloPlaca('');
      setIsDialogOpen(false);
    }
  };

  const handleEditCavalo = async (cavalo: CavaloMecanico) => {
    if (!newCavaloNomeFreota.trim() || !newCavaloPlaca.trim()) return;

    const success = await updateCavalo(cavalo.id, {
      nomeFreota: newCavaloNomeFreota.trim(),
      placa: newCavaloPlaca.trim()
    });

    if (success) {
      setEditingCavalo(null);
      setNewCavaloNomeFreota('');
      setNewCavaloPlaca('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCavalo = async (id: string) => {
    await deleteCavalo(id);
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
              Cole os dados dos cavalos mecânicos, uma entrada por linha no formato: Nome_da_Frota Placa (ex: T2506 SYL4A24)
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
              <Button 
                onClick={handleImportData} 
                className="bg-primary hover:bg-primary/90"
                disabled={loading.cavalos}
              >
                {loading.cavalos ? 'Importando...' : 'Importar Dados'}
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
                setNewCavaloNomeFreota('');
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
                  <Label htmlFor="nomeFreota">Nome da Frota</Label>
                  <Input
                    id="nomeFreota"
                    value={newCavaloNomeFreota}
                    onChange={(e) => setNewCavaloNomeFreota(e.target.value)}
                    placeholder="Ex: T2506"
                  />
                </div>
                <div>
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    value={newCavaloPlaca}
                    onChange={(e) => setNewCavaloPlaca(e.target.value)}
                    placeholder="Ex: SYL4A24"
                  />
                </div>
                <Button 
                  onClick={editingCavalo ? () => handleEditCavalo(editingCavalo) : handleAddCavalo}
                  className="w-full"
                  disabled={loading.cavalos}
                >
                  {loading.cavalos ? 'Processando...' : (editingCavalo ? 'Atualizar' : 'Adicionar')}
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
                      <p className="font-medium">{cavalo.nomeFreota} - {cavalo.placa}</p>
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
                          setNewCavaloNomeFreota(cavalo.nomeFreota);
                          setNewCavaloPlaca(cavalo.placa);
                          setIsDialogOpen(true);
                        }}
                        disabled={loading.cavalos}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCavalo(cavalo.id)}
                        disabled={loading.cavalos}
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
