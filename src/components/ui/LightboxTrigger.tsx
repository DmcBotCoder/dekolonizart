'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { openLightbox, type LightboxImage } from './Lightbox';

interface LightboxTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  image: LightboxImage;
  children: ReactNode;
}

/** Button that opens an image (poster) in the site-wide lightbox. */
export function LightboxTrigger({ image, children, ...rest }: LightboxTriggerProps) {
  return (
    <button type="button" {...rest} onClick={() => openLightbox(image)}>
      {children}
    </button>
  );
}
