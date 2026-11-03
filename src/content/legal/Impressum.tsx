import { LegalValue } from '@/components/ui/LegalValue';
import { countTodos, legal } from './data';

const used = [legal.legalForm, legal.street, legal.city, legal.representedBy, legal.phone, legal.register, legal.vatId, legal.editorial, legal.lastUpdated];

/** Impressum (German only – legally binding version). Source: OnPoint build template. */
export function ImpressumDocument() {
  const missing = countTodos(...used);
  return (
    <div lang="de">
      {missing > 0 && (
        <p className="legal-warning" role="note">
          <strong>Vorlage – noch nicht veröffentlichungsreif.</strong> {missing} Angaben fehlen noch (rot markiert). Bitte in{' '}
          <code>src/content/legal/data.ts</code> ergänzen und juristisch prüfen lassen.
        </p>
      )}
      <h2>
        Angaben gemäß § 5 <abbr title="Digitale-Dienste-Gesetz">DDG</abbr>
      </h2>
      <p>
        {legal.name}
        <br />
        <LegalValue value={legal.legalForm} />
        <br />
        <LegalValue value={legal.street} />
        <br />
        <LegalValue value={legal.city} />
        <br />
        {legal.country}
      </p>
      <h3>Vertreten durch</h3>
      <p>
        <LegalValue value={legal.representedBy} />
      </p>
      <h3>Kontakt</h3>
      <p>
        E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>
        <br />
        Telefon: <LegalValue value={legal.phone} />
      </p>
      <h3>Registereintrag</h3>
      <p>
        <LegalValue value={legal.register} />
      </p>
      <h3>Umsatzsteuer-ID</h3>
      <p>
        <LegalValue value={legal.vatId} />
      </p>
      <h3>
        Verantwortlich für den Inhalt nach § 18 Abs. 2 <abbr title="Medienstaatsvertrag">MStV</abbr>
      </h3>
      <p>
        <LegalValue value={legal.editorial} />
      </p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
        rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
        Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
        Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>
      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
        mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
        derartige Links umgehend entfernen.
      </p>
      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten – insbesondere Texte, Fotos, Plakate und das Logo –
        unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
        Urheberrechts bedürfen der schriftlichen Zustimmung von DekolonizArt. Soweit Inhalte nicht vom Betreiber erstellt wurden, werden die
        Urheberrechte Dritter beachtet.
      </p>
      <h2>Abkürzungen</h2>
      <dl className="abbr-list">
        {[
          ['Abs.', 'Absatz'],
          ['DDG', 'Digitale-Dienste-Gesetz'],
          ['MStV', 'Medienstaatsvertrag'],
          ['USt-IdNr.', 'Umsatzsteuer-Identifikationsnummer'],
          ['UStG', 'Umsatzsteuergesetz'],
          ['e. V.', 'eingetragener Verein'],
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
