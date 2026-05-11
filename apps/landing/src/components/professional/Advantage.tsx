import IntroBlog from "../common/intro-blog";
import { Clock, Forecast, Manual, Phone, PuzzlePiece, Support } from "../icons";

const ProfessionalAdvantage: React.FC = () => {
  const data = [
    {
      title: "Fick nya kundförfrågningar direkt",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">Städbolag</h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            “Från tom kalender till fullbokad på rekordtid”
          </p>
        </>
      ),
      icon: <Manual />,
    },
    {
      title: "Enkel offerthantering och full kontroll med Time Flow",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">Byggare</h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            {`“Gör offerter snabbt, följ upp enkelt och stäng fler affärer"`}
          </p>
        </>
      ),
      icon: <Support />,
    },
    {
      title: "TimeFlow frigör timmar varje vodka",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">Målare</h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            {`“Varje sparad timme ger dig nya fakturerbara timmar.”`}
          </p>
        </>
      ),
      icon: <Clock />,
    },
    {
      title: "Äntligen ett verktyg som har alla funktioner vi letat efter.",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">Elektriker</h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            {`“Vi har testat många system - nu har vi hittat det som verkligen
            fungerar.”`}
          </p>
        </>
      ),
      icon: <PuzzlePiece />,
    },
    {
      title: "Smart stöd för att minska risken för arbetsplatsolyckor.",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">Takläggare</h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            {`“Första systemet som faktiskt minskar olyckorna. Exakt det vi sökt
            och verkligen behöver."`}
          </p>
        </>
      ),
      icon: <Phone />,
    },
    {
      title: "TimeFlow ger dig kontroll på ekonomin med smarta prognoser.",
      description: (
        <>
          <h1 className="text-[#0e0c0c] content-primary-size">
            Fastigets utvecklare
          </h1>
          <p className="mt-3 text-sm lg:text-lg xl-text-xl">
            {`“Första systemet som faktiskt minskar olyckorna. Exakt det vi sökt
            och verkligen behöver."`}
          </p>
        </>
      ),
      icon: <Forecast />,
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-10 md:mt-20">
      <IntroBlog
        data={data}
        title="Röster från användare"
        description="Upptäck hur TimeFlow har förändrat vardagen för andra företagare i din
          bransch"
      />
    </div>
  );
};

export default ProfessionalAdvantage;
