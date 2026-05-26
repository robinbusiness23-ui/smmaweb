export default function Datenschutz() {
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

        <h1 className="text-4xl font-black mb-2">Datenschutzerklärung</h1>
        <p style={{ color: "#8888a0", fontSize: "14px", marginBottom: "48px" }}>Gemäß DSGVO · Stand: 2026</p>

        <div className="space-y-10" style={{ lineHeight: "1.8" }}>
          <Section title="1. Verantwortliche Stelle">
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="mt-2">
              <strong>contentstudio · Robin Obrechtle</strong><br />
              [Straße und Hausnummer]<br />
              79[XXX] Freiburg im Breisgau<br />
              E-Mail: <a href="mailto:robin@obrechtle.de" style={{ color: "#4c6ef5" }}>robin@obrechtle.de</a><br />
              Telefon: [TELEFON]
            </p>
          </Section>

          <Section title="2. Erhebung und Verarbeitung personenbezogener Daten">
            <p>Wir erheben personenbezogene Daten nur, wenn ihr uns diese im Rahmen des Kontaktformulars oder per E-Mail freiwillig mitteilt. Dazu gehören:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: "#a0a0b8" }}>
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Name des Unternehmens</li>
              <li>Freitext der Nachricht</li>
            </ul>
            <p className="mt-3">Diese Daten werden ausschließlich zur Bearbeitung eurer Anfrage genutzt und nicht an Dritte weitergegeben.</p>
          </Section>

          <Section title="3. Rechtsgrundlage">
            <p style={{ color: "#a0a0b8" }}>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Verarbeitung zur Erfüllung eines
              Vertrags oder zur Durchführung vorvertraglicher Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an der Beantwortung von Anfragen).
            </p>
          </Section>

          <Section title="4. Speicherdauer">
            <p style={{ color: "#a0a0b8" }}>
              Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfallen ist und keine
              gesetzlichen Aufbewahrungspflichten entgegenstehen – in der Regel nach 3 Jahren.
            </p>
          </Section>

          <Section title="5. Google Fonts">
            <p style={{ color: "#a0a0b8" }}>
              Diese Website verwendet Google Fonts zur Darstellung von Schriftarten. Beim Laden der Seite werden
              Verbindungen zu Google-Servern hergestellt, dabei kann eure IP-Adresse übertragen werden.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einheitlicher Darstellung).
              Alternativ können wir die Schriftarten lokal einbinden – sprecht uns an.
            </p>
          </Section>

          <Section title="6. Eure Rechte">
            <p>Ihr habt jederzeit das Recht auf:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: "#a0a0b8" }}>
              <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung eurer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-3">Zur Ausübung eurer Rechte wendet euch an: <a href="mailto:robin@obrechtle.de" style={{ color: "#4c6ef5" }}>robin@obrechtle.de</a></p>
          </Section>

          <Section title="7. Beschwerderecht">
            <p style={{ color: "#a0a0b8" }}>
              Ihr habt das Recht, euch bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren.
              In Baden-Württemberg ist dies der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg (LfDI BW), Lautenschlagerstraße 20, 70173 Stuttgart.
            </p>
          </Section>
        </div>

        <p style={{ marginTop: "64px", color: "#555568", fontSize: "12px" }}>
          ⚠️ Dies ist eine vereinfachte Vorlage. Bitte alle Platzhalter ersetzen und ggf. durch einen Rechtsanwalt prüfen lassen.
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
