import type { Locale } from '../config';
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import type { Messages } from './types';

export type { Messages, GlossaryItem } from './types';

const dictionaries: Record<Locale, Messages> = { en, de, fr };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

/** Replaces `{name}` placeholders, like the reference's `t(key, vars)`. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}
