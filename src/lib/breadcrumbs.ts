import { findNavParent } from '@/content/navigation';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import type { Crumb } from '@/components/ui/PageHero';

/**
 * Home → (menu parent, if the page sits in a dropdown) → current page,
 * the same trail logic as the reference. `extra` inserts additional ancestors.
 */
export function buildCrumbs(path: string, locale: Locale, t: Messages, extra: { href: string; label: string }[] = []): Crumb[] {
  const crumbs: Crumb[] = [{ href: localizePath('/', locale), label: t.nav.home.label }];
  const parent = findNavParent(path);
  if (parent) crumbs.push({ href: localizePath(parent.href, locale), label: (t.nav[parent.id] as { label: string }).label });
  extra.forEach((crumb) => crumbs.push({ href: localizePath(crumb.href, locale), label: crumb.label }));
  return crumbs;
}
