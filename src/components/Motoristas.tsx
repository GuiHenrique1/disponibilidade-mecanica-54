
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Motorista } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Motoristas: React.FC = () => {
  const { motoristas, loading, addMotorista, updateMotorista, deleteMotorista, importMotoristasEmMassa } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [newMotoristaNome, setNewMotoristaNome] = useState('');
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredMotoristas = motoristas.filter(motorista =>
    motorista.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

    const result = await importMotoristasEmMassa(importText);
    
    if (result.errors.length > 0) {
      toast({
        title: "Importação com erros",
        description: `${result.success} importados, ${result.errors.length} erros`,
        variant: "destructive"
      });
    }
    
    setImportText('');
  };

  const handleAddMotorista = async () => {
    if (!newMotoristaNome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome.",
        variant: "destructive"
      });
      return;
    }

    const success = await addMotorista({
      nome: newMotoristaNome.trim()
    });

    if (success) {
      setNewMotoristaNome('');
      setIsDialogOpen(false);
    }
  };

  const handleEditMotorista = async (motorista: Motorista) => {
    if (!newMotoristaNome.trim()) return;

    const success = await updateMotorista(motorista.id, {
      nome: newMotoristaNome.trim()
    });

    if (success) {
      setEditingMotorista(null);
      setNewMotoristaNome('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteMotorista = async (id: string) => {
    await deleteMotorista(id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Motoristas</h1>
        
        {/* Card Total */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Total de Motoristas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{motoristas.length}</div>
          </CardContent>
        </Card>

        {/* Importação em Massa */}
        <Card>
          <CardHeader>
            <CardTitle>Importação em Massa - Motoristas</CardTitle>
            <CardDescription>
              Cole os nomes dos motoristas, um por linha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="João Silva&#10;Maria Santos&#10;Carlos Oliveira&#10;..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleImportData} 
                className="bg-primary hover:bg-primary/90"
                disabled={loading.motoristas}
              >
                {loading.motoristas ? 'Importando...' : 'Importar Dados'}
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
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingMotorista(null);
                setNewMotoristaNome('');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Motorista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMotorista ? 'Editar Motorista' : 'Adicionar Motorista'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={newMotoristaNome}
                    onChange={(e) => setNewMotoristaNome(e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <Button 
                  onClick={editingMotorista ? () => handleEditMotorista(editingMotorista) : handleAddMotorista}
                  className="w-full"
                  disabled={loading.motoristas}
                >
                  {loading.motoristas ? 'Processando...' : (editingMotorista ? 'Atualizar' : 'Adicionar')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Motoristas */}
        <Card>
          <CardHeader>
            <CardTitle>Motoristas Cadastrados ({filteredMotoristas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredMotoristas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum motorista encontrado.
                </p>
              ) : (
                filteredMotoristas.map((motorista) => (
                  <div key={motorista.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{motorista.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Cadastrado em: {new Date(motorista.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMotorista(motorista);
                          setNewMotoristaNome(motorista.nome);
                          setIsDialogOpen(true);
                        }}
                        disabled={loading.motoristas}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMotorista(motorista.id)}
                        disabled={loading.motoristas}
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
