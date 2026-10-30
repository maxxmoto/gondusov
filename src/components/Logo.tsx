import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="./logotip.webp"
    alt="Dr. Gondusov"
    className={className}
    width={300}
    height={174}
    decoding="async"
  />
);
