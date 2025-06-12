
import React from 'react';
import { useLogo } from '@/hooks/useLogo';

export const LogoDisplay: React.FC = () => {
  const { logoUrl } = useLogo();

  if (!logoUrl) {
    return null;
  }

  return (
    <div className="flex items-center">
      <img 
        src={logoUrl} 
        alt="Logo da empresa" 
        className="h-8 max-w-32 object-contain"
      />
    </div>
  );
};
