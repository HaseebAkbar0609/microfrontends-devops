import { Check } from "@/components/icons";

const ProfessionalAboutUsContent: React.FC = () => {
  const data = [
    "TimeFlow System OÜ är ett innovativt teknikbolag med en tydlig vision - att digitalisera och modernisera hantverksbranschen. Genom nästa generations projektsystem hjälper vi hantverksföretag att bli mer effektiva, öka sin lönsamhet, minska antalet misstag och skapa en tryggare arbetsmiljö med färre arbetsplatsolyckor.",
    "Vi vet vad branschen kräver - och vi har byggt TimeFlow System från grunden utifrån verkliga behov. Med rötter i hantverksyrkena och en djup förståelse för branschens utmaningar, kombinerar vi praktisk erfarenhet med avancerad teknik för att leverera en plattform i absolut framkant.",
    "TimeFlow System OÜ har sitt huvudkontor i Tallinn, Estland, med verksamhet och närvaro i flera länder. All utveckling, drift och försäljning sker i egen regi - det ger oss full kontroll över kvalitet, funktion och support. Våra lösningar finns tillgängliga för PC, iPad och mobil och anpassas till det dagliga arbetet på byggplatsen, i bilen eller på kontoret.",
    "Med stöd av den senaste Al-tekniken är TimeFlow ett komplett projekt- och leadssystem för hantverksbolag. Plattformen innehåller smarta funktioner som offertverktyg, resursplanering, kalkyler, projekthantering, ekonomi, arbetsmiljö, inköp och mycket mer - samlat i ett och samma system.",
    "Vår drivkraft är er framgång. Att driva ett hantverksföretag är utmanande - men avgörande för samhället. Vi vill vara en partner i er vardag och bidra till en mer hållbar och lönsam framtid för hantverksbranschen. Tillsammans utvecklar vi en smartare arbetsmiljö och en bättre vardag.",
  ];

  const system = [
    {
      label: "Skapat för hantverksbranschen",
      content:
        "Utvecklat av yrkesfolk - för yrkesfolk. Vi vet vad som krävs på riktigt.",
    },
    {
      label: "Internationell SaaS-plattform",
      content: "Huvudkontor i Tallinn, Estland. Verksamhet i flera länder.",
    },
    {
      label: "Fungerar på PC, surfplatta och mobil",
      content:
        "Oavsett om du är på kontoret, i bilen eller på byggarbetsplatsen.",
    },
    {
      label: "Byggt med Al - nästa generations verktyg",
      content:
        "Smart projekthantering, leadshantering, kalkyl, offert, KMA, ekonomi m.m.",
    },
    {
      label: "Ökad effektivitet och lönsamhet",
      content:
        "Minska misstag, spara tid och få bättre kontroll över hela verksamheten.",
    },
    {
      label: "Allt-i-ett system för hantverksbolag",
      content:
        "Offertverktyg, projekt, inköp, personal, maskiner, arbetsmiljö och mycket mer.",
    },
    {
      label: "Utvecklat och ägt i egen regi",
      content:
        "Inga mellanhänder - vi ansvarar för hela upplevelsen och kvaliteten.",
    },
    {
      label: "Vi brinner för er framgång",
      content:
        "Vi ser hantverkarens roll som en nyckel i samhället - vi är här för att stötta er varje dag.",
    },
  ];
  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        <div className="flex flex-col gap-4 md:gap-8">
          {data.map((item, key) => (
            <p key={key} className="content-secondary-size text-[#5B5B5B]">
              {item}
            </p>
          ))}
        </div>
        <div className="">
          <img
            className="w-full h-auto"
            src="/images/professional/about-us/content/1.png"
            alt="content_1.png"
          />
        </div>
      </div>

       {/* About Timeflow */}
        <section className="pt-24 pb-10 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tigh ">
              Om Timeflow: Byggt för
              <span className="text-primary italic">
                svenska hantverkare och byggare
              </span> 
            </h2>
          </div>
        </section>

      <div className="grid md:grid-cols-2 gap-6 md:gap-12 mt-5 md:mt-10">
        <div>
          <img
            className="w-full h-auto"
            src={"/images/professional/about-us/content/2.png"}
            alt="content_2.png"
          />
        </div>
        <div className="fex flex-col">
          <p className="timeflow-subtitle-size font-bold">
            Det här är TimeFlow System i korthet
          </p>
          <div className="flex flex-col gap-5 md:gap-10 mt-6 md:mt-12">
            {system.map((item, key) => (
              <div key={key} className="flex flex-col gap-3 md:gap-6">
                <div className="flex gap-2 items-start">
                  <span className="w-6 h-6">
                    <Check />
                  </span>
                  <span className="footer-title-size text-primary-500 font-bold text-left">
                    {key + 1}. {item.label}
                  </span>
                </div>
                <p className="content-secondary-size">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAboutUsContent;
