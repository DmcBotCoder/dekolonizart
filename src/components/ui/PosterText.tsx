import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import styles from './PosterText.module.css';

interface PosterTextProps {
  poster: 'saveTheDate' | 'theaterGeschichte';
  locale: Locale;
  t: Messages['posterText'];
}

/** The text of a poster image as real text (posters are images of text). */
export function PosterText({ poster, locale, t }: PosterTextProps) {
  return (
    <details className={`poster-text ${styles.posterText}`}>
      <summary>{t.summary}</summary>
      {poster === 'saveTheDate' ? (
        <div className={styles.body}>
          {t.std.map((line, i) => {
            // Line 0 is English ("Save the Date"), line 2 the German play title.
            const lang = i === 2 && locale !== 'de' ? 'de' : i === 0 && locale !== 'en' ? 'en' : undefined;
            return (
              <p key={line} lang={lang}>
                {i === 0 || i === 2 ? <strong>{line}</strong> : line}
              </p>
            );
          })}
        </div>
      ) : (
        <div className={styles.body}>
          {t.tgNote && <p className={styles.note}>{t.tgNote}</p>}
          {t.tg.map((line, i) => (
            <p key={line}>{i === 0 ? <strong>{line}</strong> : line}</p>
          ))}
        </div>
      )}
    </details>
  );
}
