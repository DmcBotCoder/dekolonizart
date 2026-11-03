import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { localizePath, type Locale } from '@/i18n/config';

/**
 * Minimal inline markup for content files, so copy can stay out of JSX:
 * `**bold**`, `[label](/internal-path)`, `[label](mailto:…)`, `[label](https://…)`
 * and a line break with `\n`. Internal paths are localized; a `lang`
 * can be given to a link as `[label](/path "de")`.
 */
const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\((\S+?)(?:\s+"(\w+)")?\)|\n/g;

export function RichText({ text, locale }: { text: string; locale: Locale }) {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const [token, bold, label, href, lang] = match;
    if (bold) out.push(<strong key={key++}>{bold}</strong>);
    else if (label && href) {
      if (href.startsWith('/')) {
        out.push(
          <Link key={key++} href={href.startsWith('/de/') || href.startsWith('/fr/') ? href : localizePath(href, lang === 'en' ? 'en' : locale)} lang={lang}>
            {label}
          </Link>,
        );
      } else {
        const external = href.startsWith('http');
        out.push(
          <a key={key++} href={href} lang={lang} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
            {label}
          </a>,
        );
      }
    } else if (token === '\n') out.push(<br key={key++} />);
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
