import React from "react";

const ProfessionalAppWorkContent: React.FC = () => {
  const phoneImg =
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758084062/Frame_2147225719_sb4uv1.png";
  const manImg =
    "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758084062/Group_13_nek0tg.png";

  const sections = [
    {
      title: "Spara tid och kostnader – var du än är",
      subtitle: "Tids - och kostnadsspårning",
      description:
        "Med TimeFlow System får du och ditt team full kontroll över både arbetstid och utgifter i varje projekt. Oavsett om ni jobbar från kontoret eller ute på arbetsplatsen kan ni enkelt registrera tid, dokumentera kostnader och säkerställa att inget faller mellan stolarna.",
      image: phoneImg,
    },
    {
      title: "Snabbare och mer exakt fakturering",
      description:
        "Med TimeFlow System blir faktureringen både snabbare och mer träffsäker. Se videon för att upptäcka hur enkelt du kan spåra tid och kostnader för hela teamet, alla projekt och arbetsmoment – och omvandla dem till fakturor med några klick.",
      videoLabel: "Manus 31",
      videoSrc:
        "https://play.gumlet.io/embed/68f1e73abefe20b134d377b1",
    },
    {
      title: "Tilläggsarbeten",
      subtitle: "Registrera utgifter direkt – eller när det passar dig",
      description:
        "Med TimeFlow System är det enkelt att hålla koll på utgifterna. Lägg till dem direkt ute på fältet eller registrera allt på en gång när du är tillbaka på kontoret. Fakturera med ett klick och få betalt snabbare.",
      image: phoneImg,
    },
    {
      title: "SPÅRNING AV MASKINER OCH FORDON",
      description:
        "TimeFlow kan du inte bara spåra tid och kostnader – du kan även enkelt hålla koll på användning av maskiner och fordon i dina projekt. Få full översikt över resurser, användningsgrad och koppla dem direkt till rätt arbetsorder eller kostnadsställe.",
      image: phoneImg,
    },
    {
      title: "Full kontroll på egenkontroller och riskhantering",
      description:
        "Minska risker och förebygg olyckor med TimeFlow System. Med TimeFlow System får du total översikt över egenkontroller, säkerhetsrutiner och riskhantering i varje projekt. Systemet hjälper dig och ditt team att arbeta säkrare, följa rätt processer och dokumentera allt i realtid – direkt i appen.",
      note: "Se vår förklaringsvideo och upptäck hur TimeFlow Work förebygger felaktigheter och arbetsplatsolyckor.",
      videoLabel: "Manus 32",
      videoSrc:
        "https://play.gumlet.io/embed/68f1e73abefe20b134d377b1",
    },
  ];

  return (
    <div className="container mx-auto py-10 md:py-20 px-4 space-y-20 md:px-20">
      <div>
        <h1 className="text-4xl font-bold text-center">
          App Timeflow Work <br /> Spara tid – få full kontroll över jobbet
        </h1>
      </div>

      {sections.map((section, i) => (
        <div
          key={i}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Text Section */}
          <div className={i % 2 === 1 ? "md:order-2" : "md:order-1"}>
            <h3 className="font-bold text-xl md:text-2xl">{section.title}</h3>
            {section.subtitle && (
              <p className="text-primary-500 font-bold mt-2">
                {section.subtitle}
              </p>
            )}
            <p className="text-[#5B5B5B] mt-6 leading-relaxed">
              {section.description}
            </p>
            {section.note && (
              <p className="mt-4 text-sm text-gray-600">💡 {section.note}</p>
            )}
          </div>

          {/* Media Section (Image or Video) */}
          <div className={i % 2 === 1 ? "md:order-1" : "md:order-2"}>
            {section.videoSrc ? (
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <iframe
                  loading="lazy"
                  title={section.videoLabel || "TimeFlow Video"}
                  src={section.videoSrc}
                  style={{
                    border: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  }}
                  className="rounded-xl"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                ></iframe>
              </div>
            ) : (
              <img
                src={section.image}
                alt={`section-${i}`}
                className="w-full max-w-md mx-auto"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfessionalAppWorkContent;
