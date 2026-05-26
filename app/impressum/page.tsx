export default function Impressum() {
  return (
    <main className="min-h-screen" style={{ background: "#13131a", color: "#f0f0f5", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <a href="/" className="inline-flex items-center gap-2 text-sm mb-12 transition-colors"
          style={{ color: "#4c6ef5" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zur Startseite
        </a>

        <h1 className="text-4xl font-black mb-2">Impressum</h1>
        <p style={{ color: "#8888a0", fontSize: "14px", marginBottom: "48px" }}>Angaben gemäß § 5 TMG</p>

        <div className="space-y-10" style={{ lineHeight: "1.8" }}>
          <Section title="Anbieter">
            <p><strong>contentstudio</strong></p>
            <p>Robin Obrechtle</p>
            <p>[Straße und Hausnummer]</p>
            <p>79[XXX] Freiburg im Breisgau</p>
            <p>Deutschland</p>
          </Section>

          <Section title="Kontakt">
            <p>Telefon: <a href="tel:[TELEFONNUMMER]" style={{ color: "#4c6ef5" }}>[TELEFONNUMMER]</a></p>
            <p>E-Mail: <a href="mailto:robin@obrechtle.de" style={{ color: "#4c6ef5" }}>robin@obrechtle.de</a></p>
          </Section>

          <Section title="Vertretungsberechtigte Person">
            <p>Robin Obrechtle</p>
          </Section>

          <Section title="Umsatzsteuer-ID">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</p>
            <p>[USt-IdNr.]</p>
          </Section>

          <Section title="Berufsbezeichnung und berufsrechtliche Regelungen">
            <p>Berufsbezeichnung: Marketingdienstleister</p>
            <p>Zuständige Kammer: [falls zutreffend]</p>
          </Section>

          <Section title="Haftung für Inhalte">
            <p style={{ color: "#a0a0b8", fontSize: "14px" }}>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
              oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich.
            </p>
          </Section>

          <Section title="Haftung für Links">
            <p style={{ color: "#a0a0b8", fontSize: "14px" }}>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </Section>

          <Section title="Urheberrecht">
            <p style={{ color: "#a0a0b8", fontSize: "14px" }}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </Section>
        </div>

        <p style={{ marginTop: "64px", color: "#555568", fontSize: "12px" }}>
          ⚠️ Bitte ersetze alle Platzhalter in eckigen Klammern mit euren echten Angaben.
        </p>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ color: "#ffffff", fontWeight: "700", fontSize: "18px", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {title}
      </h2>
      <div style={{ color: "#b0b0c8" }}>{children}</div>
    </div>
  );
}
