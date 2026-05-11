const ProfessionalHowItWorksContent: React.FC = () => {
  return (
    <div className="container mx-auto px-10 py-12 md:py-20">
      {/* Section 1 */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Kom igång med TimeFlow Home – enkelt och kostnadsfritt
          </h2>
          <p className="text-gray-700 mb-4">
            Med TimeFlow Home får du full kontroll över dina bygg- och
            renoveringsprojekt. Som privatperson kan du skapa ett kostnadsfritt
            konto och direkt börja använda appen för att:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Skicka offertförfrågningar till hantverkare</li>
            <li>Jämföra offerter och välja den som passar dig bäst</li>
            <li>Följa upp pågående arbeten</li>
            <li>Hålla koll på kostnader, tidplan och dokument</li>
          </ul>
          <p className="text-gray-700 mt-4">Allt samlat på ett ställe – direkt i mobilen.</p>
        </div>
        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382909/c7f4e767f6049ec0cc41578f816633cefca08262_f3bork.png"
            alt="Family using TimeFlow"
            className="rounded-xl shadow-lg h-90 mt-10"
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="mb-12">
        <h3 className="text-xl font-bold mb-3">
          Ladda ner vår mobilapp - TimeFlow Home
        </h3>
        <p className="text-gray-700">
          TimeFlow Home finns på App Store och Google Play. Logga in och kom
          igång på några minuter.
        </p>
      </div>

      {/* Section 3 */}
      <div className="mb-12">
        <h3 className="text-xl font-bold mb-3">Hitta rätt hantverkare och konsulter</h3>
        <p className="text-gray-700">
          I TimeFlow Home kan du enkelt hitta hantverkare eller konsulter, ta in
          offerter och jämföra deras omdömen, referenser och tillgänglighet. På
          så sätt gör du ett tryggt val för ditt projekt.
        </p>
      </div>

      {/* Section 4 */}
      <div className="mb-12">
        <h3 className="text-xl font-bold mb-3">Hantera inställningar och kom igång snabbt</h3>
        <p className="text-gray-700 mb-3">
          Med vårt projektverktyg kan du och hantverkaren samarbeta digitalt
          genom hela processen – från avtal till slutbesiktning. Du får tillgång
          till funktioner som:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Tidsplan och budget</li>
          <li>Dokument och mötesanteckningar</li>
          <li>Frågor & svar</li>
          <li>Ändrings- & tilläggsarbeten</li>
          <li>Fakturor och garantier</li>
        </ul>
      </div>

      {/* Section 5 */}
      <div className="mb-12">
        <h3 className="text-xl font-bold mb-3">Mer än bara ett projektverktyg</h3>
        <p className="text-gray-700">
          Med TimeFlow Home får du tryggare projekt, bättre kontroll och sparar
          både tid och pengar. Dessutom hittar du tips, råd och
          prisindikationer direkt i appen för att förenkla ditt projekt.
        </p>
      </div>

      {/* Section 6 */}
      <div>
        <h3 className="text-xl font-bold mb-3">Support när du behöver</h3>
        <p className="text-gray-700">
          Behöver ni hjälp? Vårt supportteam och hjälpfunktion finns direkt
          tillgängliga i systemet så att ni alltid har tillgång till vägledning
          när ni behöver det.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalHowItWorksContent;
