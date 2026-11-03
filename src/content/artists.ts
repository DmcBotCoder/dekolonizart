import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import type { ImageAsset } from './media';

/**
 * Artists appearing in productions. `slug` is the stable anchor used by
 * `/artists#<slug>` – never derive it from list position.
 *
 * Long texts may contain one `<!--more-->` marker: everything after it is
 * hidden behind "Read More" (editorial control, no fixed heights).
 */
export interface Artist {
  slug: string;
  name: string;
  location?: string;
  role: keyof Messages['artists']['roles'];
  photo?: ImageAsset & { alt?: string };
  website?: string;
  /** Biography in the language it was written in. */
  bio?: { lang: Locale; paragraphs: string[] };
}

export const artists: Artist[] = [
  {
    slug: 'ngako-keuni',
    name: 'Ngako Keuni',
    location: 'Berlin',
    role: 'ngako',
    photo: { src: '/img/artists/ngako-keuni.webp', width: 1282, height: 1920 },
    website: 'https://www.ngakokeuni.com/',
    // Source: WordPress "event actors page" (German only).
    bio: {
      lang: 'de',
      paragraphs: [
        'Der Schauspieler, Sänger und Tänzer Ngako Keuni absolvierte 2016-2020 an der Universität der Künste Berlin den Studiengang „Musical”. Im Rahmen seines Studiums gewann er den „BOBBY WALDEN PREIS“ und erhielt das DEUTSCHLAND STIPENDIUM.',
        'Geboren in Kamerun, sollte er nach dem Wunsch seines Vaters Priester werden. So fing er an im Internat Trommeln zu spielen und später im Chor zu singen. Nachdem er aus dem katholischen Internat geschmissen wurde, stand Ngako nach seinem Abitur in Kamerun als Perkussionist, Opernsänger oder Tänzer auf der Bühne.<!--more--> Parallel studierte er Wirtschaftswissenschaft. Allerdings war es in seiner Familie nicht willkommen, Künstler zu sein und in der Kamerunischen Gesellschaft schwierig, fast unmöglich, davon zu leben. So zog Ngako 2013 erstmal nach Qatar und später nach Deutschland, um seiner Musik- und Tanzleidenschaft zu folgen. Im Jahr 2019 spielte er Woda in dem Musical Drachenherz unter der Regie von Peter Lund und Mathias Noack sowie der Choreografin Neva Howard, eine Co-Produktion des Staatstheaters Chemnitz und der Neuköllner Oper. 2020 übernahm er die Rolle des Blechmann in dem Stück Der Zauberer von Oz am Staatstheater Kassel unter der Regie von Martina van Boxen. 2022 war Ngako auf Tour als Charles in der Komödie Monsieur Claude 2. Die Regie führte Stefan Zimmermann vom A.gon Theater in München. Er spielte in 2022/2023 als Gilbert und Seaweed am Staatstheater Nürnberg in der Produktion Hairspray mit der Regisseurin Melissa King. Sein jüngster Auftritt auf der Bühne war in Bad Münstereifel in der Theaterproduktion Macht euch die Erde untertan. Aktuell ist Ngako in den Bad Hersfelder Sommerfestspielen 2023 als Simon Zealotes in dem Musical Jesus Christ Superstar mit dem Regisseur Stefan Huber und der Choreografin Melissa King zu sehen.',
        'Ngako ist auch freischaffend unterwegs, als afrikanischer Tanzlehrer und Darsteller. Er wirkte 2021 in dem Musik-Video Tam Tam als Choreograph, Regisseur und Arrangeur mit. 2022 Und 2023 war er Krimhilder am Theater Expedition Metropolis in Berlin und im Theater Heidelberg – Zwinger X in dem Theaterstück Schwarze Zukunft: Eine afrofuturistische Märchenstunde- oder auch nicht, eine Produktion von Goblin Baby. In der Uraufführung des Theaterstückes Macht euch die Erde untertan, entwickelte er selbst die Rolle des Murayas, eines Flüchtlings aus Afrika.',
      ],
    },
  },
  {
    slug: 'athanasios-karakantas',
    name: 'Athanasios Karakantas',
    role: 'composer',
  },
];

export function getArtist(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}
