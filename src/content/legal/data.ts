/**
 * Legal facts used by the Impressum, Datenschutz and accessibility statement.
 * Values starting with `TODO:` are rendered as highlighted placeholders – they
 * were also unfilled in the reference and must be supplied (and legally
 * reviewed) before publication.
 */
export const legal = {
  name: 'DekolonizArt',
  legalForm: 'TODO: Rechtsform (z. B. e.V., gUG, GbR, Einzelunternehmen)',
  street: 'TODO: Straße und Hausnummer',
  city: 'TODO: PLZ Ort',
  country: 'Deutschland',
  representedBy: 'TODO: Vertretungsberechtigte Person(en), z. B. Vorstand',
  email: 'info@dekolonizart.com',
  phone: 'TODO: Telefonnummer (oder Zeile entfernen und zweiten schnellen Kontaktweg angeben)',
  register: 'TODO: Registergericht und Registernummer (z. B. Amtsgericht Charlottenburg, VR …) – entfällt, falls nicht eingetragen',
  vatId: 'TODO: USt-IdNr. nach § 27a UStG – entfällt, falls keine vorhanden',
  editorial: 'TODO: Name und Anschrift der inhaltlich verantwortlichen Person (§ 18 Abs. 2 MStV)',
  hosting: 'TODO: Name und Anschrift des Hosting-Anbieters',
  lastUpdated: 'TODO: Datum der letzten Prüfung',
  youtubeLegalBasis:
    'TODO: Rechtsgrundlage klären – die Intro-Videos werden beim Seitenaufruf ohne vorherige Einwilligung von YouTube geladen. Deutsche Aufsichtsbehörden verlangen für solche Einbettungen in der Regel eine Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO), z. B. über ein Feld „Video laden“. Bitte juristisch prüfen und den Text anpassen.',
  enforcement:
    'TODO: Prüfen, ob DekolonizArt als öffentlich geförderte Stelle unter das Berliner Barrierefreie-IKT-Gesetz fällt. Falls ja: Hinweis auf die Durchsetzungsstelle des Landes Berlin ergänzen. Falls nein: Abschnitt entfernen.',
} as const;

export const countTodos = (...values: string[]) => values.filter((value) => value.startsWith('TODO:')).length;
