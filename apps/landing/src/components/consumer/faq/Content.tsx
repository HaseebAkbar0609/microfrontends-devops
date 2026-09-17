const ConsumerFaqContent: React.FC = () => {
  return (

    <div className="container mx-auto py-10 md:py-20 px-4">
      {/* FAQ */}
        <section className="pt-16 pb-16">
          <div className="max-w-3xl ">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tigh ">
              Vanliga frågor om
              <span className="text-primary italic">
                Timeflow byggsystem
              </span> 
            </h2>
          </div>
        </section>
        
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Om TimeFlow System
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">Varför använder vi cookies?</p>
            <p className="content-secondary-size text-[#5B5B5B]">
              TimeFlow System är ett smart digitalt verktyg som hjälper dig som
              privatperson att planera, upphandla och driva bygg- och
              renoveringsprojekt. Du kan enkelt skapa projekt, ta in offerter
              från kvalitetssäkrade hantverkare och följa hela processen - från
              start till slutfört arbete. Allt är samlat på ett och samma ställe
              - helt gratis för dig.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vem kan använda TimeFlow System?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              TimeFlow System riktar sig till privatpersoner som söker
              hantverkare eller planerar projekt inom bygg, renovering,
              installationer eller liknande. Systemet används också av
              professionella hantverkare och företag som erbjuder sina tjänster
              via plattformen.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vilka typer av företag hittar jag i TimeFlow System?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Vi har anslutna företag inom över 100 olika hantverksbranscher -
              till exempel Bygg & Betong, Mark & Schakt, Fasad & Puts, El, VVS,
              Städ & Underhåll, Arkitekter, Konsulter och specialistföretag.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Kostar TimeFlow System något för mig som privatperson?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Nej, det är helt gratis att använda TimeFlow System som konsument.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Finns TimeFlow System i andra länder?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Ja, systemet är internationellt och byggs kontinuerligt ut. På
              timeflowsystem.se kan du se vilka länder som är aktiva. Du kan
              även lägga upp projekt i andra länder - exempelvis om du har ett
              fritidshus utomlands.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Kom igång
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Hur lång tid tar det att komma igång?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Så snart du registrerat ett konto kan du börja använda systemet
              direkt.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Måste jag använda alla funktioner i TimeFlow System?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Nej. Du kan själv välja vilka funktioner du vill använda. Men vi
              rekommenderar att utforska fler delar av systemet det är utformat
              för att spara tid och ge dig bättre kontroll i dina projekt.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">Hur skapar jag ett projekt?</p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Gå till funktionen Offertförfrågan. Där kan du beskriva ditt
              projekt, bifoga bilder eller ritningar. Inom kort får du offerter
              från duktiga hantverkare. Du kan även bjuda in egna kontakter
              eller leverantörer att lämna offert.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Upphandling och offert
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vad gör jag om jag får för dyra offerter - eller ångrar mig?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Inga problem. Du kan enkelt tacka nej till offerter direkt i
              systemet. Det är helt utan förpliktelser.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Hur vet jag att hantverkarna är seriösa?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Vi arbetar endast med verifierade företag. Du kan se
              företagsinformation, omdömen, behörigheter och
              försäkringsuppgifter direkt i systemet.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Kan jag bjuda in egna hantverkare till projektet?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Ja, du kan lägga till egna kontakter i din leverantörslista och
              bjuda in dem att lämna offert eller delta i projektverktyget.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Projektledning
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vad händer när jag valt en hantverkare?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Då aktiverar du projektverktyget. Du får tillgång till digitala
              avtal, budget, tidsplan, dokumenthantering, kontrollplaner,
              besiktning, kommunikation och mycket mer - allt i ett och samma
              verktyg. Glöm inte att ladda ner appen TimeFlow Home för att ha
              full översikt direkt i mobilen.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Måste hantverkaren vara ansluten till TimeFlow System?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Ja, för att kunna använda projektverktyget fullt ut behöver
              hantverkaren vara registrerad i TimeFlow System.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Stöder systemet ROT- och RUT-avdrag?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Ja, TimeFlow System hanterar både ROT- och RUT-avdrag. Du fyller i
              dina uppgifter i projektet, så får den valda hantverkaren tillgång
              till informationen direkt.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Kan jag ha flera projekt samtidigt?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Absolut. Du kan driva flera projekt parallellt och enkelt växla
              mellan dem. Du har även tillgång till historik från tidigare
              projekt för full spårbarhet.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Kan jag samarbeta med andra i mitt projekt?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Ja, du kan bjuda in flera medlemmar till ditt konto och ge dem
              tillgång till specifika projekt. Perfekt för familjemedlemmar
              eller samarbetspartners.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Appar & teknisk info
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vilka enheter stödjer appen TimeFlow Home?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Appen finns för både iOS (App Store) och Android (Google Play) och
              fungerar på både telefoner och surfplattor.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Vad är skillnaden mellan TimeFlow Home och TimeFlow Work?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              TimeFlow Home är för dig som privatperson. TimeFlow Work används
              av hantverksföretagen och deras personal.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Support & hjälp
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Hur får jag hjälp om jag fastnar?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Vi erbjuder support via telefon, e-post och chatt. Du har även
              tillgång till en omfattande hjälpguide direkt i systemet.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="font-bold text-primary-500 header-secondary-size">
            Säkerhet & integritet
          </p>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">
              Hur skyddas mina uppgifter i TimeFlow System?
            </p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Vi följer branschstandard för datasäkerhet med HTTPS, krypterad
              datalagring hos Amazon Web Services (AWS), Vi uppfyller kraven
              enligt GDPR och raderar din data senast tre månader efter avslutat
              konto, med undantag för uppgifter som krävs enligt lag.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <p className="footer-title-size">Vem äger min data?</p>
            <p className="content-secondary-size text-[#5B5B5B]">
              Du äger din information. Vi behandlar dina uppgifter med respekt,
              transparens och högsta säkerhet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerFaqContent;
