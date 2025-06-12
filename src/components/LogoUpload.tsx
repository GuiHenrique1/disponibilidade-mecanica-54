
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useLogo } from '@/hooks/useLogo';

export const LogoUpload: React.FC = () => {
  const { logoUrl, uploadLogo, removeLogo } = useLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadLogo(file);
        console.log('Logo carregada com sucesso');
      } catch (error) {
        console.error('Erro ao carregar logo:', error);
        alert(error instanceof Error ? error.message : 'Erro ao carregar a imagem');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Logo da Empresa</Label>
        <p className="text-xs text-muted-foreground">
          Carregue a logo da sua empresa (PNG, JPG, SVG)
        </p>
      </div>

      {logoUrl ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center p-4 border border-border rounded-lg bg-muted/50">
            <img 
              src={logoUrl} 
              alt="Logo da empresa" 
              className="max-h-16 max-w-48 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Alterar Logo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={removeLogo}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleUploadClick}
          className="w-full h-20 border-dashed border-2 hover:border-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <Image className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clique para carregar a logo
            </span>
          </div>
        </Button>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
