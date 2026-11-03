/**
 * One-off asset migration from the WordPress media library.
 *
 * Downloads the original uploads, resizes them to the largest size the
 * site actually renders (2x for retina) and writes them to /public.
 * next/image then serves responsive AVIF/WebP variants from these sources.
 *
 * Usage: node scripts/migrate-assets.mjs [target …]
 * With targets (e.g. img/media/offer-movement.webp) only those files are
 * migrated; without, everything including the display font.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const WP = 'https://dekolonizart.com/wp-content/uploads';

/** [source path on WordPress, target path in /public, transform (`extract` crops before resizing)] */
const manifest = [
  // Brand
  ['2026/06/D-E-K-O-L-O-N-I-Z-6.png', 'img/logo.png', { width: 1080, format: 'png' }],
  // Partners
  ['2026/09/D-E-K-O-L-O-N-I-Z-5.png', 'img/partners/conservatoire.png', { width: 440, format: 'png' }],
  ['2026/09/D-E-K-O-L-O-N-I-Z-8.png', 'img/partners/casa.png', { width: 440, format: 'png' }],
  // Posters
  ['2026/10/Save-the-date-Pub.-Read.png', 'img/media/poster-save-the-date.jpg', { width: 1135, format: 'jpeg' }],
  ['2026/10/Theater-KreaBrukk.png', 'img/media/poster-theater-geschichte.jpg', { width: 1135, format: 'jpeg' }],
  ['2026/07/Plakat-DMB-Der-Konig-der-Recht-wollte-3.webp', 'img/media/poster-douala-manga-bell.webp', { format: 'webp' }],
  // Workshops
  ['2026/10/Borchert-Schule-Spandau_8-Klasse_Bewegung-scaled.jpeg', 'img/media/workshop-spandau.jpg', { width: 1800, format: 'jpeg' }],
  ['2026/10/GISD_6-Klasse_Qatar-scaled.jpg', 'img/media/workshop-doha-group.jpg', { width: 1800, format: 'jpeg' }],
  ['2026/10/GISD-Qatar_6-Klasse-scaled.jpg', 'img/media/workshop-doha-drum.jpg', { width: 1800, format: 'jpeg' }],
  // Productions
  ['2026/06/Screenshot-2025-07-05-170022.webp', 'img/media/the-tragedy-of-melilla.webp', { format: 'webp' }],
  ['2026/07/DMB-crowdfunding-cover.webp', 'img/media/douala-manga-bell-residency.webp', { format: 'webp' }],
  // Production page hero: the portrait from the crowdfunding cover (without the cover's text)
  ['2026/07/DMB-crowdfunding-cover.webp', 'img/media/douala-manga-bell-portrait.webp', { extract: { left: 568, top: 132, width: 557, height: 512 }, format: 'webp' }],
  // Home "Our Offers" card backgrounds (the "Performance projects" card reuses the Melilla photo, as on WordPress)
  ['2026/06/Screenshot-14.webp', 'img/media/offer-workshops.webp', { extract: { left: 55, top: 0, width: 1809, height: 962 }, width: 1200, format: 'webp' }],
  ['2026/08/photo_2026-08-11_17-36-39.webp', 'img/media/offer-movement.webp', { format: 'webp' }],
  // Team
  ['2026/08/Ngakoportraitaktuell1-scaled.webp', 'img/team/ngako-keuni.webp', { width: 1920, format: 'webp' }],
  ['2026/10/Team-member-1.jpg', 'img/team/shila.jpg', { format: 'jpeg' }],
  ['2026/10/Team-member-3.jpg', 'img/team/sophie.jpg', { format: 'jpeg' }],
  ['2026/10/Team-member-2NEW.jpg', 'img/team/ben.jpg', { format: 'jpeg' }],
  ['2026/10/Team-member-4.jpg', 'img/team/kuti.jpg', { format: 'jpeg' }],
  ['2026/10/Team-member-5.jpg', 'img/team/edmond.jpg', { format: 'jpeg' }],
  ['2026/10/Team-member-6.jpg', 'img/team/alicia.jpg', { format: 'jpeg' }],
  // Artists
  ['2026/07/BB18376-scaled.webp', 'img/artists/ngako-keuni.webp', { format: 'webp' }],
];

async function run() {
  const only = process.argv.slice(2);
  for (const [src, target, { extract, width, format }] of manifest) {
    if (only.length && !only.includes(target)) continue;
    const res = await fetch(`${WP}/${src}`);
    if (!res.ok) throw new Error(`${res.status} for ${src}`);
    const input = Buffer.from(await res.arrayBuffer());
    let img = sharp(input).rotate();
    if (extract) img = img.extract(extract);
    if (width) img = img.resize({ width, withoutEnlargement: true });
    if (format === 'jpeg') img = img.flatten({ background: '#ffffff' }).jpeg({ quality: 84, mozjpeg: true });
    if (format === 'png') img = img.png({ compressionLevel: 9, palette: true });
    if (format === 'webp') img = img.webp({ quality: 84 });
    const out = await img.toBuffer({ resolveWithObject: true });
    const dest = join(root, 'public', target);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, out.data);
    console.log(`${target}  ${out.info.width}x${out.info.height}  ${(out.data.length / 1024).toFixed(0)} KB`);
  }

  if (only.length) return;

  // Display font (same file the WordPress theme and the OnPoint build use).
  const font = await fetch(`${WP}/2026/08/MovementV.ttf`);
  const fontDest = join(root, 'src/fonts/MovementV.ttf');
  await mkdir(dirname(fontDest), { recursive: true });
  await writeFile(fontDest, Buffer.from(await font.arrayBuffer()));
  console.log('src/fonts/MovementV.ttf');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
