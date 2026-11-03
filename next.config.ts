import type { NextConfig } from 'next';

/** Old WordPress URLs → new routes (keeps inbound links and search rankings). */
const legacyRedirects: [string, string][] = [
  // Localized WordPress page slugs
  ['/de/home-deutsch', '/de'],
  ['/fr/home-francais', '/fr'],
  ['/de/ueber', '/de/about'],
  ['/fr/elementor-3714', '/fr/about'],
  ['/de/geschichte', '/de/history'],
  ['/fr/histoire', '/fr/history'],
  ['/de/das-team', '/de/the-team'],
  ['/fr/lequipe', '/fr/the-team'],
  ['/de/dienstleistungen', '/de/services'],
  ['/fr/nos-services', '/fr/services'],
  ['/de/theater-2', '/de/theater'],
  ['/fr/theatre-2', '/fr/theater'],
  ['/de/artistic-3', '/de/artistic'],
  ['/fr/artistic-2', '/fr/artistic'],
  ['/de/movement-dance-3', '/de/movement-dance'],
  ['/fr/movement-dance-2', '/fr/movement-dance'],
  ['/de/kontakt', '/de/contact'],
  ['/fr/contact-2', '/fr/contact'],
  // Productions, artists and programme pages
  ['/douala-manga-bell-synopsis', '/events/douala-manga-bell'],
  ['/douala-manga-bell', '/events/douala-manga-bell'],
  ['/rudolf-douala-manga-bell-event-termines', '/events/douala-manga-bell'],
  ['/elementor-4046', '/events/the-tragedy-of-melilla'],
  ['/the-tragedy-of-melilla', '/events/the-tragedy-of-melilla'],
  ['/tam-tam', '/events/tam-tam'],
  ['/event-actors-page', '/artists'],
  ['/program', '/theater'],
  ['/performances', '/theater'],
  ['/workshops', '/artistic'],
  ['/fags', '/services'],
  // Same alias as the reference build
  ['/leichte-sprache', '/de/easy-read'],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // A package-lock.json in a parent folder would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
