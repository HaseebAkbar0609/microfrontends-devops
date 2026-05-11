import {
  Group,
  Map,
  Money,
  WebinarCalendar,
  WebinarClock,
} from "@/components/icons";

const ProfessionalWebinarParticipate: React.FC = () => {
  const data = [
    {
      title: "Varje onsdag",
      tag: "När?",
      icon: <WebinarCalendar />,
    },
    {
      title: "10:00-10:36",
      tag: "Tid",
      icon: <WebinarClock />,
    },
    {
      title: "20 personer",
      tag: "Max antal deltagare",
      icon: <Group />,
    },
    {
      title: "Helt gratis",
      tag: "Pris",
      icon: <Money />,
    },
    {
      title: "Online via Microsoft Teams",
      tag: "Plats",
      icon: <Map />,
    },
  ];

  return (
    <div className="container mx-auto mt-10 md:mt-20 flex flex-col items-center max-w-5xl px-4">
      <p className="text-2xl md:text-3xl font-bold text-center text-gray-900">
        Välj ett datum och anmäl dig – delta i vårt kostnadsfria webinar!
      </p>

      <p className="text-base md:text-lg text-gray-600 mt-8 text-center">
        Varje onsdag kl. 10:00–10:36 bjuder vi in till ett kostnadsfritt webinar
        där du får en inspirerande introduktion till projektverktyget
        TimeFlowSystem – skräddarsytt för hantverksbranschen.
      </p>
      <p className="text-base md:text-lg text-gray-600 mt-4 text-center">
        Du får en tydlig genomgång av systemets viktigaste funktioner och hur
        det kan hjälpa dig att digitalisera och effektivisera din verksamhet.
      </p>

      <div className="mt-12 grid md:grid-cols-3 lg:grid-cols-5 gap-8">
        {data.map((item, key) => (
          <div
            key={key}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#F2F2F2]">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.tag}</p>
              <p className="text-base md:text-lg font-semibold text-gray-900">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-base md:text-lg text-gray-600 mt-12 text-center">
        Efter att du registrerat dig får du en bekräftelse via e-post med en
        Teams-länk samt en inbjudan direkt till din Outlook-kalender – enkelt
        och smidigt.
      </p>
    </div>
  );
};

export default ProfessionalWebinarParticipate;
