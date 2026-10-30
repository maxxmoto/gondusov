import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="./logo.png"
    alt="Dr. Gondusov"
    className={className}
    width={1204}
    height={700}
    decoding="async"
  />
);
