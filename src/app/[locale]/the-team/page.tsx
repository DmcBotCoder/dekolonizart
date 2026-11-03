import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/ui/PageHero';
import { initials, team } from '@/content/team';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { TeamGrid } from './TeamGrid';
import styles from './team.module.css';

const PATH = '/the-team';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.team, description: t.team.intro });
}

export default async function TeamPage() {
  const { locale, t } = await getI18n();

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.team}
        eyebrow={t.team.eyebrow}
        title={t.team.title}
        intro={t.team.intro}
      />
      <section className="section">
        <h2 className="sr-only">{t.team.membersH}</h2>
        <TeamGrid>
          {team.map((member, i) => (
            <article key={member.name} className={styles.member}>
              <div className={styles.frame}>
                {member.photo ? (
                  <Image
                    className={styles.photo}
                    src={member.photo.src}
                    alt={format(t.team.portraitOf, { name: member.name })}
                    width={member.photo.width}
                    height={member.photo.height}
                    sizes="(min-width: 1180px) 270px, (min-width: 560px) 45vw, 90vw"
                    style={member.photo.position ? { objectPosition: member.photo.position } : undefined}
                  />
                ) : (
                  <div className={`${styles.photo} ${styles.placeholder}`} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                    <img src="/img/logo.png" alt="" className={styles.mark} />
                    <span>{initials(member.name)}</span>
                  </div>
                )}
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.info}>
                <h3>{member.name}</h3>
                <p>{t.team.roles[member.role]}</p>
              </div>
            </article>
          ))}
        </TeamGrid>
      </section>
    </>
  );
}
