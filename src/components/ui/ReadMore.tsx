'use client';

import { useId, useState } from 'react';
import styles from './ReadMore.module.css';

export const MORE_MARKER = '<!--more-->';

export type ReadMoreBlock = { kind: 'p' | 'h3'; text: string };

interface ReadMoreProps {
  blocks: ReadMoreBlock[];
  labels: { more: string; less: string };
  lang?: string;
}

/**
 * Editor-controlled "Read More". The break point is wherever the content
 * contains `<!--more-->` (like WordPress) – no fixed heights. Before the
 * break: visible text + "…"; after it: `.read-more-content`, which stays in
 * the normal document flow so everything below moves naturally.
 * Without a marker the full text is shown and no button is rendered.
 */
export function ReadMore({ blocks, labels, lang }: ReadMoreProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const breakIndex = blocks.findIndex((block) => block.kind === 'p' && block.text.includes(MORE_MARKER));

  const renderBlock = (block: ReadMoreBlock, key: number) =>
    block.kind === 'h3' ? (
      <h3 key={key} className={styles.subhead}>
        {block.text}
      </h3>
    ) : (
      <p key={key}>{block.text}</p>
    );

  if (breakIndex === -1) return <div lang={lang}>{blocks.map(renderBlock)}</div>;

  const [visible, continuation] = blocks[breakIndex].text.split(MORE_MARKER);
  const before = blocks.slice(0, breakIndex);
  const after = blocks.slice(breakIndex + 1);

  return (
    <div className={styles.readMore} lang={lang}>
      {before.map(renderBlock)}
      <p>
        {visible.trimEnd()}
        <span className="read-more-dots" aria-hidden="true" hidden={open}>
          …
        </span>
        <span id={`${id}-inline`} className="read-more-content" hidden={!open}>
          {' '}
          {continuation.trimStart()}
        </span>
      </p>
      {after.length > 0 && (
        <div id={`${id}-rest`} className={`read-more-content ${styles.rest} ${open ? styles.open : ''}`} aria-hidden={!open} inert={!open}>
          <div>{after.map(renderBlock)}</div>
        </div>
      )}
      <button
        type="button"
        className={`btn btn--ghost ${styles.toggle}`}
        aria-expanded={open}
        aria-controls={after.length ? `${id}-inline ${id}-rest` : `${id}-inline`}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? labels.less : labels.more}
      </button>
    </div>
  );
}
