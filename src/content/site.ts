/** Site-wide facts that are not translated. */
export const site = {
  name: 'DekolonizArt',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dekolonizart.com').replace(/\/$/, ''),
  email: 'info@dekolonizart.com',
  logo: '/img/logo.png',
} as const;

/**
 * Social profiles. The reference (and WordPress) only link to the network
 * home pages – the real profile URLs still have to be supplied.
 */
export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
] as const;

/** Current performance venue (link from the WordPress home page). */
export const venue = {
  name: 'Miriam Makeba Saal',
  street: 'Am Sudhaus 2',
  city: '12053 Berlin',
  place: 'Berlin Global Village',
  mapUrl: 'https://maps.app.goo.gl/PSsxbUVyh8oJ8czE7',
} as const;
