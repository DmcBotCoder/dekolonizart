'use client';

import { useSyncExternalStore } from 'react';
import { isReducedMotion, subscribeNever } from '@/lib/motion/state';
import { youTubeEmbedUrl } from '@/lib/youtube';
import styles from './YouTubeVideo.module.css';

interface YouTubeVideoProps {
  id: string;
  /** Accessible name of the player. */
  title: string;
  /** Link text for visitors without JavaScript. */
  fallbackLabel: string;
}

type Mode = 'autoplay' | 'paused';
const clientMode = (): Mode => (isReducedMotion() ? 'paused' : 'autoplay');
const serverMode = (): Mode | null => null;

/**
 * Inline YouTube player that starts by itself and loops. Autoplay is muted
 * because browsers block autoplay with sound; the player's own controls
 * pause, resume and unmute it. Visitors who reduce motion get the player
 * paused instead. The iframe is only added in the browser, once that
 * preference is known, so it never loads twice.
 */
export function YouTubeVideo({ id, title, fallbackLabel }: YouTubeVideoProps) {
  const mode = useSyncExternalStore(subscribeNever, clientMode, serverMode);

  return (
    <div className={styles.frame}>
      {mode && (
        <iframe
          src={youTubeEmbedUrl(id, { autoplay: mode === 'autoplay' })}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <noscript>
        <a className={styles.fallback} href={`https://www.youtube.com/watch?v=${id}`}>
          {fallbackLabel}
        </a>
      </noscript>
    </div>
  );
}
