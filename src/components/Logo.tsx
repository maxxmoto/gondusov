import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="./logo.webp"
    alt="Dr. Gondusov"
    className={className}
    width={512}
    height={298}
    decoding="async"
  />
);
