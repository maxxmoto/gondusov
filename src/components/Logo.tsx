import React from 'react';
import { Picture } from './Picture';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <Picture src="./logo.webp" alt="Логотип" className={className} loading="eager" />
);
