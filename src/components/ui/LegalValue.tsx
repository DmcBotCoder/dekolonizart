import styles from './LegalValue.module.css';

/** Placeholder marker for legal data that still has to be supplied (`TODO:` prefix). */
export const isTodo = (value: string) => value.startsWith('TODO:');

export function LegalValue({ value }: { value: string }) {
  if (!isTodo(value)) return <>{value}</>;
  return (
    <mark className={styles.todo} title="Noch ausfüllen in src/content/legal/data.ts">
      [{value.replace(/^TODO:\s*/, '')}]
    </mark>
  );
}
