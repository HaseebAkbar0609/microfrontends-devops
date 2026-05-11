import News from "../common/news";

const ProfessionalLandingNews: React.FC = () => {
  const data = [
    {
      title: "Full kontroll över verksamheten",
      description: (
        <>
          Med TimeFlow har du alltid koll på dina projekt, uppdrag och ekonomi.
          Följ arbetet i realtid, håll deadlines och se till att inget faller
          mellan stolarna. <br />
          All information samlad på ett ställe – tillgängligt var du än är.
          Jobba smartare, planera bättre och väx ditt företag med struktur.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/1.png",
    },
    {
      title: "Ta projekt som hantverkare – få nya kunder med TimeFlow",
      description: (
        <>
          Som ansluten hantverkare kan du enkelt ta del av lediga projekt. Välj
          uppdrag som passar din kompetens och ditt schema.
          <br />
          Varje nytt projekt är en chans att visa din kvalitet – och få fler
          kunder. Bygg relationer, få omdömen och väx med varje uppdrag.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/2.png",
    },
    {
      title: "Så sparar TimeFlow tid för hantverkare",
      description: (
        <>
          TimeFlow är utvecklat för att förenkla vardagen för hantverkare. Med
          digitala verktyg för offert, planering, dokumentation och fakturering
          på ett och samma ställe, slipper du pappersarbete och dubbeljobb. Du
          får full kontroll över dina projekt, kan snabbt kommunicera med kunder
          och kollegor, och har alltid tillgång till rätt information – direkt i
          mobilen. Mindre administration och mer tid på fältet betyder fler
          fakturerbara timmar och en smidigare arbetsdag.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/3.png",
    },
    {
      title: "Ett system – många funktioner",
      description: (
        <>
          TimeFlow samlar allt du behöver som hantverkare i ett och samma
          verktyg. Hantera offerter, projektplanering, kundkontakt,
          tidrapportering och fakturor – digitalt och smidigt.
          <br />
          Få överblick över hela verksamheten, spara tid och jobba mer
          effektivt. Allt samlat – alltid tillgängligt, oavsett var du är.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/4.png",
    },
  ];

  return (
    <div className="bg-[#F2F2F2] py-10 md:py-20">
      <div className="container mx-auto px-4">
        <News resource={data} />
      </div>
    </div>
  );
};

export default ProfessionalLandingNews;
