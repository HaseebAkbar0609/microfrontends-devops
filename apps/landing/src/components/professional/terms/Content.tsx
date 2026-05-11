// src/components/professional/terms/Content.tsx
import React from "react";

const ProfessionalTermsContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 text-left">
      <h1 className="text-2xl md:text-3xl font-bold">
        ALLMÄNNA VILLKOR FÖR SAAS-TJÄNSTEN TIMEFLOW SYSTEM
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Version 1.1 - Gäller från och med 2025-07-02
      </p>

      {/* Publisher */}
      <div className="mt-6 text-gray-700">
        <p className="font-semibold">Utgivare</p>
        <p>TimeFlow System OÜ</p>
        <p>Org.nr: [Organisationsnummer]</p>
        <p>Adress: Padriku tee 12/3-4, 11912 Tallinn, Estland</p>
        <p>E-post: support@timeflowsystem.com</p>
      </div>

      <div className="mt-8 space-y-10 text-gray-800">
        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            TimeFlow System OÜ
          </h3>
          <p className="leading-relaxed">
            TimeFlow System OÜ (&quot;TimeFlow&quot;, &quot;vi&quot;, &quot;oss&quot;, &quot;vårt&quot;) är utgivare av den
            molnbaserade tjänsten TimeFlow System (&quot;Tjänsten&quot;). Tjänsten säljs, marknadsförs och
            supporteras i respektive land av lokala partner/återförsäljare på uppdrag av TimeFlow System OÜ.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            1. Tillämpning och godkännande
          </h3>
          <p className="leading-relaxed">
            Dessa villkor (&quot;Villkoren&quot;) reglerar användningen av TimeFlow System, en SaaS-lösning för
            projekt- och affärsstyrning riktad till professionella företag inom hantverks- och byggsektorn.
            Genom att registrera ett konto eller använda tjänsten bekräftar du (&quot;Kund&quot;, &quot;Kontoinnehavare&quot;)
            att du tagit del av och accepterar Villkoren.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            2. Behörighet och krav för registrering
          </h3>
          <p className="leading-relaxed">
            För att få använda tjänsten krävs att kunden uppfyller följande:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Är ett registrerat företag med giltigt organisationsnummer.</li>
            <li>Är momspliktig eller innehar motsvarande skattekvalifikation (t.ex. F-skattebevis).</li>
            <li>Har giltig företagsadress och kontaktuppgifter.</li>
            <li>Efterlever gällande branschregler, licenser och lokala lagar.</li>
          </ul>
          <p className="mt-2 leading-relaxed">
            TimeFlow förbehåller sig rätten att neka eller avsluta ett konto vid bristande efterlevnad,
            identifierad affärsrisk eller misstänkt bedräglig verksamhet.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            3. Konto, licens och användarrätt
          </h3>
          <p className="leading-relaxed">
            Kunden erhåller en begränsad, icke-exklusiv och icke-överlåtbar rätt att nyttja tjänsten inom sin organisation.
            Kontot får inte lånas ut, hyras ut eller användas i strid mot tillämplig lag. All användning loggas och
            omfattas av åtkomst- och säkerhetskontroller. TimeFlow äger samtliga immateriella rättigheter till plattformen.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            4. Avtalstid, uppsägning och automatiska förnyelser
          </h3>
          <p className="leading-relaxed">
            Avtalet löper från registreringstillfället och gäller enligt valt betalningsintervall (månad, kvartal eller år).
            Villkor för olika planer kan skilja sig:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>
              Free Plan: Om kunden inte avslutar inom provperioden omvandlas kontot enligt planens villkor (till exempel Start-plan)
              med angiven bindningstid.
            </li>
            <li>
              Betalda planer: Uppsägning ska ske i god tid före nästa faktureringsperiod, normalt minst 30 dagar före förfallodag.
            </li>
            <li>
              Uppsägning görs via kontoinställningar i systemet eller enligt instruktioner i administratörsgränssnittet.
              Om ingen uppsägning sker förlängs avtalet automatiskt och kunden debiteras enligt gällande prisplan.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            5. Systemets uppbyggnad och tillägg
          </h3>
          <p className="leading-relaxed">
            Tjänsten är modulbaserad och erbjuds i olika licensplaner. Exempel på planstrukturer:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Start: Offert, CRM, Fakturering, Mina sidor, B2B-portal m.m.</li>
            <li>Standard: Innehåller Start + Kalkyl, Projekt, Personal, Ekonomi, KMA, Order, Maskiner m.fl.</li>
            <li>PRO: Innehåller Standard + Inköp, Projektering, Prognos, Företagsledning, Dataanalys, Juridik och Marknad.</li>
          </ul>
          <p className="mt-2 leading-relaxed">
            Tilläggsmoduler och appar (t.ex. TimeFlow Work) kan aktiveras separat och faktureras enligt valt intervall (1, 3 eller 12 månader).
            Bindningstid kan gälla för vissa tillägg.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            6. Priser, betalning och villkor
          </h3>
          <p className="leading-relaxed">
            Priser för planer och tillägg framgår i systemets licensöversikt. Betalning sker normalt med registrerat betalkort eller annan
            angiven betalningsmetod.
          </p>
          <p className="leading-relaxed mt-2">
            Vid utebliven betalning görs påminnelseförsök och kunden riskerar att kontot spärras. Misslyckas betalningsförsök kvarstår
            kundens betalningsansvar enligt avtal. Kvittens och fakturor skickas till angiven e-postadress.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            6a. Leadshantering och offertdebitering
          </h3>
          <p className="leading-relaxed">
            Tjänsten kan innehålla funktioner för leadgenerering och offerthantering. Avgifter för hantering av leads eller offertbearbetning
            debiteras enligt separat prislista eller enligt de villkor som anges i systemet vid tidpunkten för användning.
            Kunden ansvarar för att svara på förfrågningar inom angivna tidsfrister. Missade deadlines och administrativa kostnader kan medföra avgifter.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            7. Aktivering och leverans
          </h3>
          <p className="leading-relaxed">
            Tjänsten aktiveras normalt omedelbart efter registrering och godkänd betalning. För kostnadsfria konton sker aktivering direkt vid registrering.
            Eventuell leverans av tillägg eller konfiguration kan kräva ytterligare tid i enlighet med informationsflödet i systemet.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            8. Ändringar av villkor
          </h3>
          <p className="leading-relaxed">
            TimeFlow förbehåller sig rätten att ändra dessa villkor. Ny version av villkoren träder i kraft 30 dagar efter att kunden meddelats
            via e-post eller systemmeddelande, om inte annat anges. Kundens fortsatta användning efter ikraftträdande innebär godkännande av de ändrade villkoren.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            9. Immateriella rättigheter
          </h3>
          <p className="leading-relaxed">
            TimeFlow System OÜ innehar samtliga immateriella rättigheter avseende Tjänsten, dess innehåll och alla tillhörande komponenter.
            All kopiering, distribution eller annan otillåten användning utan skriftligt tillstånd är förbjuden.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            10. Ansvar och ansvarsbegränsning
          </h3>
          <p className="leading-relaxed">
            TimeFlow ansvarar inte för indirekta skador eller följdskador. TimeFlows sammanlagda ersättningsskyldighet är begränsad till
            de avgifter kunden betalat för tjänsten under de senaste sex (6) månaderna, såvida inte annat följer av tvingande lag.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            11. Reklamation
          </h3>
          <p className="leading-relaxed">
            Fel i tjänsten ska reklameras till support@timeflowsystem.com inom 30 dagar från det att felet upptäcktes.
            TimeFlow skall ges möjlighet att avhjälpa felet inom skälig tid. Vid godkänd reklamation åtgärdas felet eller
            en proportionell kompensation kan utgå enligt separat bedömning.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            12. Hävning
          </h3>
          <p className="leading-relaxed">
            TimeFlow har rätt att utan föregående meddelande stänga eller avsluta ett konto vid allvarligt avtalsbrott,
            otillåten användning, säkerhetsrisk eller vid utebliven betalning. Kunden kan i vissa fall ha rätt till återstående
            obrukade perioder enligt avtalets uppsägningsregler.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            13. Personuppgifter och cookies
          </h3>
          <p className="leading-relaxed">
            Personuppgifter behandlas enligt gällande dataskyddslagstiftning (GDPR). Cookies används för funktionalitet och statistik.
            Fullständig integritets- och cookiepolicy återfinns på vår webbplats.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            14. Force majeure
          </h3>
          <p className="leading-relaxed">
            TimeFlow ansvarar inte för driftsstörningar eller förseningar som beror på omständigheter utanför TimeFlows kontroll,
            såsom krig, naturkatastrofer, pandemier, strejk eller störningar i tredjepartsinfrastruktur.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            15. Tillämplig lag och tvist
          </h3>
          <p className="leading-relaxed">
            Dessa villkor regleras av estnisk lag. Tvister som uppstår i anledning av dessa villkor ska i första hand lösas genom
            förhandlingar. Om förhandlingar inte leder till en lösning avgörs tvisten av behörig estnisk domstol, om inte annat
            avtalas skriftligen.
          </p>
        </div>

        <div>
          <h3 className="text-primary-500 font-bold mb-2">
            16. Dataskydd och säkerhet
          </h3>
          <p className="leading-relaxed">
            Kunden äger sin data. TimeFlow genomför dagliga säkerhetskopieringar och strävar efter att lagra data inom EU när så är möjligt.
            Vid avslut raderas kunddata efter 90 dagar med möjlighet till export i strukturerat format. TimeFlow följer principer för
            Privacy by Design och genomför regelbundna säkerhetsuppdateringar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTermsContent;
