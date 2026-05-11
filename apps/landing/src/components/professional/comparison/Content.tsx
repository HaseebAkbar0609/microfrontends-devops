import React from "react";

const Tick = () => (
  <div className="flex justify-center items-center">
    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
      ✓
    </div>
  </div>
);

const ProfessionalComparisonContent: React.FC = () => {
  const features = [
    {
      name: "Leadshantering (B2C/B2B)",
      values: [true, true, false, false, false, true, false, false, false],
    },
    {
      name: "Offertgenerering",
      values: [true, true, true, true, true, false, true, true, false],
    },
    {
      name: "Kalkyl & marginal (QuickAICalc)",
      values: [true, false, true, true, true, false, true, true, false],
    },
    {
      name: "Projektplanering Order, Projekt",
      values: [true, false, true, true, true, false, true, true, true],
    },
    {
      name: "Resursplanering (personal/maskin)",
      values: [true, false, true, true, true, false, true, true, true],
    },
    {
      name: "Tidsregistrering",
      values: [true, false, true, true, true, false, true, true, true],
    },
    {
      name: "Ekonomi & fakturering",
      values: [true, false, true, true, true, true, true, true, true],
    },
    {
      name: "KMA (Kvalitet, Miljö, Arbetsmiljö)",
      values: [true, false, true, false, true, false, true, false, false],
    },
    {
      name: "Inköpshantering",
      values: [true, false, true, false, false, false, false, false, false],
    },
    {
      name: "Projektering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "CRM (kundregister & historik)",
      values: [true, true, true, true, true, false, true, true, false],
    },
    {
      name: "Digital signering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Integration mobilapp",
      values: [true, false, true, true, true, false, true, true, true],
    },
    {
      name: "AI-baserade funktioner",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Allt-i-ett-lösning",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Automatisk uppföljning av leads",
      values: [true, false, false, false, false, true, false, false, false],
    },
    {
      name: "ROT/RUT-stöd",
      values: [true, false, true, true, true, false, true, true, false],
    },
    {
      name: "Support & onboarding",
      values: [true, false, true, true, true, false, true, true, true],
    },
    {
      name: "Personalhantering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Inkassohantering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Företagsledning",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Marknad/säljfunktion",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Data- och IT-funktion",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Avtalshantering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Mallar",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Prognos",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Inköp",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "Projekteringshantering",
      values: [true, false, false, false, false, false, false, false, false],
    },
    {
      name: "B2B-funktion",
      values: [true, false, false, false, false, false, false, false, false],
    },
  ];

  const systems = [
    "TimeFlow System PRO",
    "Offert",
    "Hantverksdata",
    "Rekyl",
    "Bygglet",
    "Servicefinder",
    "Next",
    "Trinax",
    "SmartDok",
  ];

  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      
      {/* ✅ FULL INTRO TEXT RESTORED */}
      <div className="max-w-4xl mx-auto md:mx-40 text-left">
        <h2 className="text-primary-500 font-bold text-xl md:text-2xl">
          Varför välja TimeFlow System?
        </h2>

        <p className="text-[#5B5B5B] mt-6 leading-relaxed">
          Det finns idag många olika digitala verktyg och systemlösningar för
          hantverksbranschen – och det ser vi som något positivt. En växande
          marknad betyder utveckling, innovation och ett ökat fokus på att
          förenkla vardagen för yrkesverksamma.
        </p>

        <p className="text-[#5B5B5B] mt-4 leading-relaxed">
          Men när vi jämför funktioner, användarvänlighet och helhetsintegration
          står TimeFlow System ut som det mest kompletta projektverktyget.
        </p>

        <p className="text-[#5B5B5B] mt-4 leading-relaxed">
          Vår lösning är inte bara en av många – det är ett fullt integrerat och
          genomtänkt system som täcker hela hantverkarens arbetsflöde. Från
          första kontakt med kund till offert, projektering, utförande,
          uppföljning och fakturering – allt i ett och samma system.
        </p>

        <p className="text-[#5B5B5B] mt-4 leading-relaxed">
          Precis som en hantverkare behöver rätt verktyg – oavsett om det är en
          hammare, skruvmejsel eller städmopp – krävs även rätt digitalt
          verktyg för att driva ett modernt och framgångsrikt
          hantverksföretag. TimeFlow System är det IT-verktyget.
        </p>

        <p className="text-[#5B5B5B] mt-4 leading-relaxed font-medium">
          Vi är nästa generations verktyg – i en bransch som utvecklas. Och vi
          utvecklas med er.
        </p>
      </div>

      {/* ✅ FIXED TABLE */}
      <div className="mt-16 overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="p-4 text-left w-[260px] relative">
                <span className="absolute bottom-6 left-4 bg-yellow-400 text-xs px-2 py-1 rounded shadow">
                  TIMEFLOW BÄSTA VAL
                </span>
              </th>

              {systems.map((system, i) => (
                <th key={i} className="p-4 text-center">
                  {system}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[#5B5B5B]">
            {features.map((feature, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-4 font-medium">{feature.name}</td>

                {feature.values.map((val, i) => (
                  <td key={i} className="p-4 align-middle">
                    {val && <Tick />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessionalComparisonContent;