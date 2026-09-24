import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <img src="./logo.JPG" alt="Логотип" className={className} />
);
