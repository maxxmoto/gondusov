import React from 'react';

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const Picture: React.FC<PictureProps> = ({ src, alt, className, width, height, loading }) => {
  const base = src.replace(/\.(webp|png|jpe?g|jfif)$/i, '');
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
};
