import type { Locale } from '@/i18n/config';

/**
 * Easy-read pages (one per language, written separately – not translations
 * of each other). Inline markup: `**bold**`, `[label](/path "lang")`, `\n`.
 */
export type EasyBlock =
  | { h2: string }
  | { p: string; lang?: Locale }
  | { explain: string }
  | { box: string[] }
  | { big: string }
  | { list: string[] };

export interface EasyReadPage {
  eyebrow: string;
  title: string;
  intro: string;
  draft: string;
  blocks: EasyBlock[];
}

const en: EasyReadPage = {
  eyebrow: 'Easy read',
  title: 'DekolonizArt – easy to read',
  intro: 'This page explains our website in simple words.',
  draft: '**Note:** This text follows the rules for easy read. It has not yet been checked by readers with learning difficulties.',
  blocks: [
    { h2: 'Who are we?' },
    { p: 'We are DekolonizArt.' },
    { p: 'We are a group of artists.' },
    { p: 'We are in Berlin, in Germany.' },
    { p: 'We started in the year 2025.' },
    { h2: 'What do we do?' },
    { p: 'We make theatre.' },
    { p: 'We dance and make music.' },
    { p: 'We tell stories from history.' },
    { p: 'We tell these stories from the view of people from Africa. Many history books only tell the view of the colonial powers.' },
    { explain: '**Colonial powers** are countries that took land in other parts of the world by force. Germany was a colonial power, too.' },
    { h2: 'Our play' },
    { p: 'Our play is about a king in Cameroon.' },
    { p: 'His name was Rudolf Duala Manga Bell.' },
    { p: 'He fought for the rights of his people.' },
    { p: 'The play has music and dance.' },
    { box: ['**First reading of the play:**', '13 December 2026', '6 pm to 9 pm', 'Miriam Makeba Saal\nAm Sudhaus 2\n12053 Berlin', 'The reading is in German.'] },
    { h2: 'Workshops' },
    { p: 'We do workshops in schools.' },
    { p: 'In a workshop, you can play theatre, dance and make music.' },
    { p: 'You do not need to know anything before.' },
    { p: 'You can bring your own ideas.' },
    { h2: 'Theatre for young people' },
    { p: 'Young people from 9 to 19 years can join.' },
    { p: 'It is every Saturday and Sunday.' },
    { p: 'Please ask us for the exact day.' },
    { p: 'It is from 2 pm to 5 pm.' },
    { p: 'It is free. You do not have to pay.' },
    { h2: 'How can you contact us?' },
    { p: 'You can write an e-mail to:' },
    { big: '[info@dekolonizart.com](mailto:info@dekolonizart.com)' },
    { p: 'Or you can use our [contact page](/contact).' },
    { h2: 'How to use this website' },
    { p: 'At the top of every page there is a button: **Accessibility**.' },
    { p: 'There you can:' },
    { list: ['make the text bigger.', 'make the colours stronger.', 'stop the moving pictures.'] },
    { p: 'You can find hard words in our [glossary](/glossary).' },
    { p: 'Diese Seite gibt es auch in [Leichter Sprache auf Deutsch](/de/easy-read).', lang: 'de' },
    { p: 'Cette page existe aussi en [français facile à lire](/fr/easy-read).', lang: 'fr' },
  ],
};

const de: EasyReadPage = {
  eyebrow: 'Leichte Sprache',
  title: 'Deko·loniz·Art in Leichter Sprache',
  intro: 'Hier erklären wir unsere Internet·seite in Leichter Sprache.',
  draft: '**Hinweis:** Dieser Text ist nach den Regeln für Leichte Sprache geschrieben. Eine Prüf·gruppe hat den Text noch nicht geprüft.',
  blocks: [
    { h2: 'Wer sind wir?' },
    { p: 'Wir heißen Deko·loniz·Art.' },
    { p: 'Wir sind eine Gruppe von Künstlern und Künstlerinnen.' },
    { p: 'Wir sind in Berlin.' },
    { p: 'Uns gibt es seit dem Jahr 2025.' },
    { h2: 'Was machen wir?' },
    { p: 'Wir machen Theater.' },
    { p: 'Wir tanzen und machen Musik.' },
    { p: 'Wir erzählen Geschichten aus der Vergangenheit.' },
    { p: 'Wir erzählen die Geschichten so, wie Menschen aus Afrika sie sehen.' },
    { p: 'Viele Geschichts·bücher erzählen nur die Sicht von den Kolonial·mächten.' },
    {
      explain:
        '**Kolonial·mächte** sind Länder. Diese Länder haben in anderen Teilen der Welt Land genommen. Sie haben dabei Gewalt benutzt. Auch Deutschland war eine Kolonial·macht.',
    },
    { h2: 'Unser Theater·stück' },
    { p: 'Unser Theater·stück handelt von einem König in Kamerun.' },
    { p: 'Kamerun ist ein Land in Afrika.' },
    { p: 'Der König hieß Rudolf Duala Manga Bell.' },
    { p: 'Er hat für die Rechte von seinem Volk gekämpft.' },
    { p: 'In dem Stück gibt es Musik und Tanz.' },
    { box: ['**Die erste Lesung von dem Stück ist am:**', '13. Dezember 2026', 'von 18 Uhr bis 21 Uhr', 'Miriam Makeba Saal\nAm Sudhaus 2\n12053 Berlin'] },
    { explain: 'Bei einer **Lesung** lesen Schau·spieler das Stück vor. Es gibt dabei auch Musik und Tanz.' },
    { h2: 'Kurse in Schulen' },
    { p: 'Wir machen Kurse in Schulen.' },
    { p: 'In den Kursen kann man Theater spielen.' },
    { p: 'Man kann tanzen und Musik machen.' },
    { p: 'Man muss vorher nichts können.' },
    { p: 'Man kann eigene Ideen mit·bringen.' },
    { h2: 'Theater für junge Menschen' },
    { p: 'Junge Menschen von 9 bis 19 Jahren können mit·machen.' },
    { p: 'Das Theater ist am Samstag und am Sonntag.' },
    { p: 'Bitte fragen Sie uns nach dem genauen Tag.' },
    { p: 'Es geht von 14 Uhr bis 17 Uhr.' },
    { p: 'Es kostet nichts.' },
    { h2: 'So erreichen Sie uns' },
    { p: 'Sie können uns eine E-Mail schreiben:' },
    { big: '[info@dekolonizart.com](mailto:info@dekolonizart.com)' },
    { p: 'Oder Sie benutzen unsere [Kontakt·seite](/contact).' },
    { h2: 'So benutzen Sie die Internet·seite' },
    { p: 'Oben auf jeder Seite ist ein Knopf.' },
    { p: 'Auf dem Knopf steht: **Barriere·freiheit**.' },
    { p: 'Dort können Sie:' },
    { list: ['die Schrift größer machen.', 'die Farben stärker machen.', 'die Bewegungen aus·schalten.'] },
    { p: 'Die Internet·seite gibt es auf Deutsch, Englisch und Französisch.' },
    { p: 'Oben auf jeder Seite können Sie die Sprache wählen: **DE** heißt Deutsch.' },
    { p: 'This page is also available in [easy read English](/easy-read "en").', lang: 'en' },
    { p: 'Cette page existe aussi en [français facile à lire](/fr/easy-read).', lang: 'fr' },
  ],
};

const fr: EasyReadPage = {
  eyebrow: 'Facile à lire et à comprendre',
  title: 'DekolonizArt en facile à lire',
  intro: 'Cette page explique notre site avec des mots simples.',
  draft:
    '**Attention :** ce texte suit les règles du « facile à lire et à comprendre » (FALC). Il n’a pas encore été relu par des personnes concernées.',
  blocks: [
    { h2: 'Qui sommes-nous ?' },
    { p: 'Nous sommes DekolonizArt.' },
    { p: 'Nous sommes un groupe d’artistes.' },
    { p: 'Nous sommes à Berlin, en Allemagne.' },
    { p: 'Nous existons depuis l’année 2025.' },
    { h2: 'Que faisons-nous ?' },
    { p: 'Nous faisons du théâtre.' },
    { p: 'Nous dansons et nous faisons de la musique.' },
    { p: 'Nous racontons des histoires du passé.' },
    { p: 'Nous racontons ces histoires comme les voient les personnes d’Afrique.' },
    { p: 'Beaucoup de livres d’histoire racontent seulement le point de vue des puissances coloniales.' },
    {
      explain:
        'Les **puissances coloniales** sont des pays. Ces pays ont pris des terres dans d’autres parties du monde. Ils ont utilisé la violence. L’Allemagne et la France étaient aussi des puissances coloniales.',
    },
    { h2: 'Notre pièce de théâtre' },
    { p: 'Notre pièce parle d’un roi au Cameroun.' },
    { p: 'Le Cameroun est un pays d’Afrique.' },
    { p: 'Le roi s’appelait Rudolf Duala Manga Bell.' },
    { p: 'Il s’est battu pour les droits de son peuple.' },
    { p: 'Dans la pièce, il y a de la musique et de la danse.' },
    {
      box: [
        '**La première lecture de la pièce a lieu le :**',
        '13 décembre 2026',
        'de 18 heures à 21 heures',
        'Miriam Makeba Saal\nAm Sudhaus 2\n12053 Berlin',
        'La lecture est en allemand.',
      ],
    },
    { explain: 'Pendant une **lecture**, des comédiens lisent la pièce à voix haute. Il y a aussi de la musique et de la danse.' },
    { h2: 'Des ateliers dans les écoles' },
    { p: 'Nous faisons des ateliers dans les écoles.' },
    { p: 'Dans un atelier, on peut faire du théâtre.' },
    { p: 'On peut danser et faire de la musique.' },
    { p: 'Il n’est pas nécessaire de savoir quelque chose avant.' },
    { p: 'On peut apporter ses propres idées.' },
    { h2: 'Du théâtre pour les jeunes' },
    { p: 'Les jeunes de 9 à 19 ans peuvent participer.' },
    { p: 'C’est le samedi et le dimanche.' },
    { p: 'Demandez-nous le jour exact.' },
    { p: 'C’est de 14 heures à 17 heures.' },
    { p: 'C’est gratuit. Vous ne payez rien.' },
    { h2: 'Comment nous contacter ?' },
    { p: 'Vous pouvez écrire un e-mail à :' },
    { big: '[info@dekolonizart.com](mailto:info@dekolonizart.com)' },
    { p: 'Ou vous pouvez utiliser notre [page de contact](/contact).' },
    { h2: 'Comment utiliser ce site' },
    { p: 'En haut de chaque page, il y a un bouton.' },
    { p: 'Sur ce bouton, il est écrit : **Accessibilité**.' },
    { p: 'Avec ce bouton, vous pouvez :' },
    { list: ['agrandir le texte.', 'rendre les couleurs plus fortes.', 'arrêter les images qui bougent.'] },
    { p: 'Le site existe en français, en allemand et en anglais.' },
    { p: 'En haut de chaque page, vous pouvez choisir la langue : **FR** veut dire français.' },
    { p: 'Vous trouvez les mots difficiles dans notre [glossaire](/glossary).' },
    { p: 'Diese Seite gibt es auch in [Leichter Sprache auf Deutsch](/de/easy-read).', lang: 'de' },
    { p: 'This page is also available in [easy read English](/easy-read "en").', lang: 'en' },
  ],
};

export const easyRead: Record<Locale, EasyReadPage> = { en, de, fr };
