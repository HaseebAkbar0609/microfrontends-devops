const ProfessionalWhyTimeFlowContent: React.FC = () => {
  const data = [
    {
      title: "Spara tid varje dag",
      description:
        "Digital hantering av tidrapportering, kostnader, egenkontroller och arbetsorder minskar administration och dubbelarbete - mer tid till själva jobbet.",
    },
    {
      title: "Ökad lönsamhet",
      description:
        "Med bättre koll på tid, material och projektekonomi minskar svinn och obetalda timmar. Ni fakturerar rätt - och i tid.",
    },
    {
      title: "Minska risken för arbetsplatsolyckor",
      description:
        "Systemet säkerställer att egenkontroller och riskbedömningar genomförs i tid - direkt i appen. Följsamhet ökar och olyckor förebyggs.",
    },
    {
      title: "Full kontroll på projekten",
      description:
        "Följ projekt i realtid - från offert till färdigställande. Spåra resurser, uppföljning och ansvar i ett och samma system.",
    },
    {
      title: "Nöjdare kunder",
      description:
        "Effektiv kommunikation, snabbare leveranser och färre missförstånd skapar trygghet och högre kundnöjdhet.",
    },
    {
      title: "Mobil arbetsledning i fält",
      description:
        "Med TimeFlow Work-appen kan teamet jobba smart direkt från mobilen - registrera tid, fota avvikelser, följa upp checklistor och se sin arbetsdag.",
    },
    {
      title: "Enkel licenshantering och tillväxt",
      description:
        "Väx med systemet! Lägg till användare, uppgradera planen eller anpassa funktioner efter företagets utveckling.",
    },
    {
      title: "Bättre dokumentation och spårbarhet",
      description:
        "All information loggas och sparas digitalt - från materialåtgång till signaturer. Enkelt att följa upp vid garantiärenden eller tvister.",
    },
    {
      title: "Importera befintliga register enkelt",
      description:
        "Kom igång snabbt genom att importera kundlistor, leverantörer och kontoplaner via Excel - inget manuellt arbete krävs.",
    },
    {
      title: "Allt samlat på ett ställe",
      description:
        "Tid, ekonomi, arbetsmiljö, personal och projekt - hantera allt i ett och samma system, utformat för hantverksbranschens vardag.",
    },
  ];

  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <div className="">
          <p className="font-bold header-secondary-size">
            Här är 10 starka skäl till varför hantverksföretag bör använda
            TimeFlow System - utformat för att spara tid, öka lönsamheten och
            skapa tryggare arbetsplatser
          </p>

          {data.map((item, key) => (
            <div key={key} className={key === 0 ? "mt-15" : "mt-10"}>
              <p className="text-primary-500 font-bold footer-title-size">
                {key + 1}. {item.title}
              </p>
              <p className="text-[#5B5B5B] content-secondary-size mt-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="">
          <img
            className="w-full"
            src={"/images/professional/whytimeflow/content/1.png"}
            alt="whytimeflow_1.png"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWhyTimeFlowContent;
