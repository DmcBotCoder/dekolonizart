import type { en } from './en';

export type Messages = typeof en;

export interface GlossaryItem {
  id: string;
  term: string;
  text: string;
  /** Language of the term itself when it differs from the page language. */
  lang?: 'en' | 'de' | 'fr';
}
