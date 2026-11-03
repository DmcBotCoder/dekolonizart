import { LegalValue } from '@/components/ui/LegalValue';
import { countTodos, legal } from './data';

const used = [legal.legalForm, legal.street, legal.city, legal.representedBy, legal.phone, legal.hosting, legal.youtubeLegalBasis, legal.lastUpdated];

const toc = [
  ['verantwortlich', 'Verantwortliche Stelle'],
  ['hosting', 'Hosting und Server-Logfiles'],
  ['kontakt', 'Kontakt per E-Mail'],
  ['speicher', 'Lokale Speicherung im Browser'],
  ['links', 'Links zu sozialen Netzwerken'],
  ['youtube', 'Eingebettete YouTube-Videos'],
  ['rechte', 'Ihre Rechte'],
  ['abk', 'Abkürzungen'],
] as const;

/**
 * Datenschutzerklärung (German only). Based on the OnPoint template; adapted
 * to this build: fonts are self-hosted (the Google Fonts section is removed,
 * as the template itself instructs) and the browser-storage list matches
 * what this site stores. Must be legally reviewed before publication.
 */
export function DatenschutzDocument() {
  const missing = countTodos(...used);
  return (
    <div lang="de">
      {missing > 0 && (
        <p className="legal-warning" role="note">
          <strong>Vorlage – noch nicht veröffentlichungsreif.</strong> {missing} Angaben fehlen noch (rot markiert). Die Texte beschreiben den
          aktuellen technischen Stand dieser Website. Ändert sich etwas (Kontaktformular-Dienst, Newsletter, Statistik, eingebettete Videos), muss
          diese Erklärung angepasst werden. Bitte juristisch prüfen lassen.
        </p>
      )}
      <nav className="toc" aria-label="Inhalt">
        <ol>
          {toc.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <h2 id="verantwortlich">1. Verantwortliche Stelle</h2>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
      <p>
        {legal.name} (<LegalValue value={legal.legalForm} />)
        <br />
        <LegalValue value={legal.street} />
        <br />
        <LegalValue value={legal.city} />
        <br />
        Vertreten durch: <LegalValue value={legal.representedBy} />
        <br />
        E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>
        <br />
        Telefon: <LegalValue value={legal.phone} />
      </p>

      <h2 id="hosting">2. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird bei folgendem Anbieter gehostet: <LegalValue value={legal.hosting} />.
      </p>
      <p>
        Beim Aufruf der Website übermittelt Ihr Browser automatisch Informationen an den Server, die in sogenannten Server-Logfiles gespeichert
        werden: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, Referrer-URL, Browsertyp und -version sowie Betriebssystem. Diese
        Daten sind technisch erforderlich, um die Website auszuliefern sowie Stabilität und Sicherheit zu gewährleisten.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionsfähigen Betrieb). Die Logfiles
        werden nach kurzer Zeit gelöscht, sofern keine längere Aufbewahrung zur Aufklärung von Sicherheitsvorfällen erforderlich ist. Mit dem
        Hosting-Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>

      <h2 id="kontakt">3. Kontakt per E-Mail</h2>
      <p>
        Diese Website hat kein Kontaktformular. Wenn Sie uns eine E-Mail schreiben (z. B. an die Adresse auf der Kontaktseite oder für eine
        Platzreservierung), erhalten wir Ihre E-Mail-Adresse, Ihre Nachricht und alle weiteren Angaben, die Sie uns darin mitteilen.
      </p>
      <p>
        Wir verarbeiten diese Daten ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre
        Anfrage mit einem Vertrag (z. B. Workshop- oder Ticketbuchung) zusammenhängt, ansonsten Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an der Beantwortung von Anfragen). Wir löschen die Daten, sobald sie nicht mehr erforderlich sind und keine gesetzlichen
        Aufbewahrungspflichten bestehen.
      </p>
      <p>
        Das Newsletter-Feld im Footer ist derzeit nicht mit einem Versanddienst verbunden; eingegebene Adressen werden nicht übertragen oder
        gespeichert.
      </p>

      <h2 id="speicher">4. Lokale Speicherung im Browser</h2>
      <p>
        Diese Website selbst setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste (zu den eingebetteten YouTube-Videos
        siehe Abschnitt 6). Die Schriftarten werden von unserem eigenen Server
        geladen. Im Speicher Ihres Browsers (Local Storage bzw. Session Storage) werden nur folgende Einträge abgelegt:
      </p>
      <ul>
        <li>
          <strong>Ihre Einstellungen zur Barrierefreiheit</strong> (Textgröße, Kontrast, Schrift, Abstände, Unterstreichung, Bewegung
          reduzieren) – nur wenn Sie diese ändern. Sie bleiben gespeichert, bis Sie sie zurücksetzen oder den Browser-Speicher löschen.
        </li>
        <li>
          <strong>Ihre Sprachwahl</strong> – nur wenn Sie die Sprache wechseln, damit die Startseite beim nächsten Besuch in dieser Sprache
          erscheint.
        </li>
        <li>
          Beim Sprachwechsel ein kurzer Vermerk, dass die Einstiegsanimation nicht erneut abgespielt werden soll; er wird beim nächsten
          Seitenaufruf sofort wieder gelöscht.
        </li>
      </ul>
      <p>
        Diese Einträge enthalten keine personenbezogenen Daten und werden nicht an uns übertragen. Die Speicherung ist nach § 25 Abs. 2 Nr. 2{' '}
        <abbr title="Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz">TDDDG</abbr> unbedingt erforderlich, um die von Ihnen ausdrücklich
        gewünschte Darstellung bereitzustellen.
      </p>

      <h2 id="links">5. Links zu sozialen Netzwerken</h2>
      <p>
        Auf unserer Website verlinken wir auf unsere Profile bei Instagram, Facebook, TikTok und YouTube. Es handelt sich um einfache Links, keine
        eingebetteten Inhalte: Erst wenn Sie einen Link anklicken, werden Sie zum jeweiligen Anbieter weitergeleitet, der dann eigene Daten
        erhebt. Für diese Verarbeitung gelten die Datenschutzerklärungen der jeweiligen Anbieter.
      </p>

      <h2 id="youtube">6. Eingebettete YouTube-Videos</h2>
      <p>
        Auf den Seiten unserer Theaterproduktionen binden wir Intro-Videos von YouTube ein. Anbieter ist die Google Ireland Limited, Gordon
        House, Barrow Street, Dublin 4, Irland. Wir nutzen den erweiterten Datenschutzmodus (youtube-nocookie.com).
      </p>
      <p>
        Der Video-Player wird beim Aufruf der Seite geladen und das Video startet ohne Ton (wenn Sie „Bewegung reduzieren“ eingeschaltet
        haben, startet es nicht von selbst; der Player wird trotzdem geladen). Dabei wird Ihre IP-Adresse an YouTube übertragen. YouTube kann
        Informationen im Speicher Ihres Browsers ablegen oder auslesen und Daten an die Google LLC in den USA übermitteln. Näheres steht in der{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
          Datenschutzerklärung von Google
        </a>
        .
      </p>
      <p>
        Rechtsgrundlage: <LegalValue value={legal.youtubeLegalBasis} />
      </p>

      <h2 id="rechte">7. Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        Wenden Sie sich dazu einfach an <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>
      <p>
        Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für Berlin ist die Berliner
        Beauftragte für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin,{' '}
        <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener">
          datenschutz-berlin.de
        </a>
        .
      </p>

      <h2 id="abk">Abkürzungen</h2>
      <dl className="abbr-list">
        {[
          ['Abs.', 'Absatz'],
          ['Art.', 'Artikel'],
          ['DSGVO', 'Datenschutz-Grundverordnung der Europäischen Union'],
          ['lit.', 'litera (Buchstabe)'],
          ['Nr.', 'Nummer'],
          ['TDDDG', 'Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz'],
          ['z. B.', 'zum Beispiel'],
        ].map(([term, meaning]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <p className="legal-meta">
        Stand: <LegalValue value={legal.lastUpdated} />
      </p>
    </div>
  );
}
