import News from "../common/news";

const ConsumerLandingNews: React.FC = () => {
  const data = [
    {
      title: "Få offert helt gratis i TimeFlow",
      description: (
        <>
          Beskriv ditt projekt och få offerter från seriösa hantverkare -utan
          kostnad.
          <br />
          Enkelt, snabbt och helt gratis för dig som kund.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/5.png",
    },
    {
      title: "Projektverktyg för smidig hantering",
      description: (
        <>
          TimeFlow ger dig ett smart och lättanvänt projektverktyg som förenklar vardagen.
          Planera uppdrag, fördela arbetsuppgifter och följ framstegen i realtid.
          All dokumentation, kommunikation och tidsrapportering på ett ställe smidigt och effektivt.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/2.png",
    },
    {
      title: "Få bra ekonomi, spar tid",
      description: (
        <>
         All kommunikation, offerter, tidsplaner, bilder och dokument samlas på ett och samma ställe –
          direkt i mobilen eller datorn. Du slipper krångliga mejltrådar och papperslappar, 
          och har alltid full överblick över ditt projekt. Med TimeFlow får du tydligare information, 
          snabbare svar från hantverkaren och en smidigare process från start till mål.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/6.png",
    },
    {
      title: "Anita proffs och experter",
      description: (
        <>
          Hitta granskade och kvalitetssäkrade hantverkare för di projekt.
          <br />
          Vi kopplar dig till rätt expert - snabbt, tryggt och enkelt. Få jobbet
          gjort av proffs med erfarenhet och goda omdömen.
        </>
      ),
      date: "17 July 2025",
      image: "/images/news/7.png",
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

export default ConsumerLandingNews;
