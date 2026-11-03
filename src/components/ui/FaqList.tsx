import styles from './FaqList.module.css';

/** Native disclosure list; the first answer is open, as in the reference. */
export function FaqList({ items, ...rest }: { items: { q: string; a: string }[] } & Record<`data-${string}`, string>) {
  return (
    <div className={styles.faq} {...rest}>
      {items.map((item, index) => (
        <details key={item.q} open={index === 0}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
