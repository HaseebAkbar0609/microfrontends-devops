import React from "react";

const ConsumerTermsContent: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-14">
        {/* Title */}
        <h2 className="text-lg font-bold mb-4">
          ALLMÄNNA VILLKOR FÖR TIMEFLOW SYSTEM – KONSUMENTVERSION
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Version 1.0 – Gäller från och med 2025-07-09
        </p>

        {/* Publisher info */}
        <div className="text-sm text-gray-700 space-y-1 mb-10">
          <p>
            <span className="font-semibold">Utgivare:</span> TimeFlow System OÜ
          </p>
          <p>
            <span className="font-semibold">Org.nr:</span> [Organisationsnummer]
          </p>
          <p>
            <span className="font-semibold">Adress:</span> Pärnu mnt 142-13, 11317 Tallinn, Estland
          </p>
          <p>
            <span className="font-semibold">E-post:</span>{" "}
            support@timeflowsystem.com
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-gray-800 text-sm leading-relaxed">
          {/* 1 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">1. Om Tjänsten</h3>
            <p>
              TimeFlow System är en kostnadsfri digital plattform som tillhandahålls av TimeFlow System OÜ 
              (“TimeFlow”, “vi”, “oss”, “vårt”). Tjänsten gör det möjligt för konsumenter (“du”, “användare”, 
              “kontoinnehavare”) att:
            </p>
            <ul className="list-decimal list-inside mt-2 space-y-1">
              <li>Söka och bjuda in hantverkare till sina projekt</li>
              <li>Ta emot och jämföra offerter</li>
              <li>Skapa en egen leverantörslista</li>
              <li>Hantera renoverings- eller byggprojekt via ett användarvänligt projektverktyg</li>
            </ul>
            <p className="mt-3">
              Tjänsten omfattar även funktioner som: tidssplanering, budget och kommunikation, dokumenthantering,
              fakturor och tilläggsarbeten, kontroller, egenkontroller, intyg, besiktning, mötes- och protokollhantering.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">2. Registrering och åtkomst</h3>
            <p>
              För att använda tjänsten krävs att du registrerar ett konto med korrekt information. 
              Du är tillåten att bjuda in tredje part till ditt konto, exempelvis en partner, konsult eller anhörig. 
              Tjänsten är helt kostnadsfri för konsumenter.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">
              3. Konto och datalagring enligt GDPR
            </h3>
            <ul className="list-decimal list-inside space-y-1">
              <li>
                En gång per år skickas ett e-postmeddelande med förfrågan om fortsatt lagring av din data enligt GDPR.
              </li>
              <li>
                Om du inte godkänner detta inom 30 dagar skickas tre påminnelser.
              </li>
              <li>
                Om ingen bekräftelse mottagits inom totalt 90 dagar stängs kontot av och all data raderas permanent.
              </li>
              <li>
                Under dessa 90 dagar är kontot inaktivt men kan aktiveras igen genom att du godkänner fortsatt datalagring.
              </li>
            </ul>
            <p className="mt-2 font-semibold">
              All data lagras inom EU, krypteras och säkerhetskopieras regelbundet.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">4. Säkerhet och användningsregler</h3>
            <p>
              Din inloggning skyddas med hög säkerhetsnivå. Du ansvarar för att din användning sker enligt gällande lagar och regler. 
              Missbruk eller skadligt beteende kan leda till avstängning.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">5. Immateriella rättigheter</h3>
            <p>
              TimeFlow System OÜ äger alla rättigheter till tjänsten och dess innehåll. Otillåten kopiering, spridning eller 
              kommersiell användning är förbjuden.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">6. Ändringar av villkor</h3>
            <p>
              Vi kan uppdatera dessa villkor. Nya versioner träder i kraft 30 dagar efter att vi informerat dig via e-post eller systemmeddelande.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">
              7. Personuppgifter och cookies
            </h3>
            <p>
              Vi behandlar personuppgifter enligt EU:s dataskyddsförordning (GDPR). Cookies används för funktion och statistik. 
              Läs mer i vår integritetspolicy på vår webbplats.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">8. Ansvarsbegränsning</h3>
            <p>
              TimeFlow System OÜ tillhandahåller tjänsten i befintligt skick och garanterar inte att alla funktioner alltid är tillgängliga. 
              Vi ansvarar inte för indirekta skador som uppstår vid användning.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h3 className="font-semibold text-[#FF914D] mb-2">9. Tillämplig lag och tvist</h3>
            <p>
              Villkoren regleras av estnisk lag. Tvister löses i första hand genom dialog med vår support. 
              Om rättslig prövning krävs sker det i estnisk domstol, om inte annat avtalats.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsumerTermsContent;
