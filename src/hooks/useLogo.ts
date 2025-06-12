
import { useState, useEffect } from 'react';

export const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem('company-logo');
    return saved || null;
  });

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('company-logo', logoUrl);
    } else {
      localStorage.removeItem('company-logo');
    }
  }, [logoUrl]);

  const uploadLogo = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Por favor, selecione um arquivo de imagem válido'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoUrl(result);
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Erro ao carregar a imagem'));
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = () => {
    setLogoUrl(null);
  };

  return { logoUrl, uploadLogo, removeLogo };
};
