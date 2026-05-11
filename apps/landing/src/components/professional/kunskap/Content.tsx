import Link from "next/link";

const ProfessionalKunskapContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="prose max-w-none">
        {/* Welcome */}
        <h2 className="text-orange-500 font-bold">
          Välkommen till TimeFlowSystem – Kunskapssida för Hantverkare
        </h2>
        <p>
          TimeFlowSystem är skapat för dig som är hantverkare – oavsett om du
          driver eget, leder ett team eller jobbar i ett större bolag. Det är en
          digital verktygslåda som förenklar, effektiviserar och moderniserar
          din vardag – direkt från offert till betalning.
        </p>

        {/* What is TimeFlow */}
        <h3 className="text-orange-500 font-bold">Vad är TimeFlowSystem?</h3>
        <p>
          Ett komplett affärssystem byggt för hantverksbranschen. Du får kontroll
          över alla delar av verksamheten: från kundförfrågan till färdigt arbete
          – med fullt stöd för ekonomi, personal, inköp, kalkyl, dokumentation,
          projekthantering och mycket mer.
        </p>

        {/* AI */}
        <h3 className="text-orange-500 font-bold">
          AI-baserad teknik som jobbar för dig
        </h3>
        <p>
          TimeFlowSystem använder AI och automatisering för att hjälpa dig ta
          bättre beslut, arbeta snabbare och minska risken för fel. Systemet lär
          sig hur du arbetar – och optimerar dina flöden därefter. Det är nästa
          generation IT-system, där människa, dator och hantverk samverkar.
        </p>

        {/* TimeFlow Work */}
        <h3 className="text-orange-500 font-bold">
          TimeFlow Work – Kontoret i fickan
        </h3>
        <p>
          Med vår mobila APP TimeFlow Work har du alltid kontoret med dig –
          oavsett om du är på byggplatsen, i bilen eller hemma hos kund.
        </p>

        <p className="font-semibold">Du kan:</p>
        <ul className="list-disc pl-6">
          <li>Skapa och skicka offerter på plats</li>
          <li>Logga timmar, material och inköp direkt från mobilen</li>
          <li>Följa projekt i realtid</li>
          <li>Ha alla dokument och checklistor tillgängliga</li>
          <li>Kommunicera direkt med teamet eller kunden</li>
        </ul>

        {/* Integration */}
        <h3 className="text-orange-500 font-bold">
          Integrerat med det du redan använder
        </h3>
        <p>
          TimeFlowSystem är integrerat med flera externa system och tjänster –
          vilket ger en sömlös hantering av data, processer och kommunikation.
        </p>
        <p className="font-semibold">Exempel:</p>
        <ul className="list-disc pl-6">
          <li>Bokföringssystem</li>
          <li>Banktjänster</li>
          <li>Leverantörsportaler</li>
          <li>Tidredovisningsverktyg</li>
          <li>Kommunikationsplattformar</li>
        </ul>
        <p>
          Allt fungerar tillsammans – du slipper dubbelarbete och felinmatningar.
        </p>

        {/* What can you do */}
        <h3 className="text-orange-500 font-bold">Vad kan du göra i TimeFlowSystem?</h3>
        <ul className="list-disc pl-6">
          <li>Skapa professionella offerter och kalkyler</li>
          <li>Ta lediga och spåra projekt som flödar in</li>
          <li>Hantera projekt, inköp och order effektivt</li>
          <li>Få full kontroll av ekonomi och projekt</li>
          <li>Ekonomi: Digitala kvitton, integration med bokföring, bank, faktura scan</li>
          <li>Digital signering, smarta mall och sms funktioner</li>
          <li>Order modul med tilläggsfunktion som Kund-direkt</li>
          <li>Maskin modul med tilläggsfunktioner: Drivare, Ruttplan</li>
          <li>Block: Offert, B2B, Kalkyl, Projekthantering</li>
          <li>Block Produktion: Order, Projekt, Inköp, Maskin, KMA, Projektering</li>
          <li>Block Ekonomi: Personal, Faktura, Prognos, Inkasso</li>
          <li>Block Företag: Avtal, Detalj, Marknad, Målare</li>
        </ul>

        {/* Benefits */}
        <h3 className="text-orange-500 font-bold">
          Varför digitalt? Fördelarna är tydliga:
        </h3>
        <ol className="list-decimal pl-6">
          <li>Spara tid</li>
          <li>Smartare arbetsplatser</li>
          <li>Få kontroll</li>
          <li>Nöjdare kunder</li>
        </ol>

        {/* Security */}
        <h3 className="text-orange-500 font-bold">Säkerhet i världsklass</h3>
        <p>
          Dina data är trygg hos oss. All information lagras hos Amazon Web
          Services (AWS) – en av världens mest pålitliga och säkra plattformar.
        </p>

        {/* Call to action */}
        <h3 className="text-orange-500 font-bold">
          Kom igång – Testa gratis i 30 dagar
        </h3>
        <p>Skapa ett konto på några minuter. Ingen bindningstid.</p>
        <p>Full funktionalitet – inga begränsningar.</p>
        <p>
          <a
            href="https://timeflowsystem.com/register/member"
            className="text-orange-500 underline"
          >
            Starta din testperiod här
          </a>
          <br />
          <Link href="/professional/pricing" className="text-orange-500 underline">
            Se våra paket och priser
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProfessionalKunskapContent;
