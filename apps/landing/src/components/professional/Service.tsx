"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Named export of the services list so other components (MobileMenu) can import it.
 * Keep the same structure you already use (title, image, resource, path).
 */
export const services = [
  {
    title: "Bygg & Betong",
    image: "/images/consumer/service/1.png",
    resource: [
      "Snickare",
      "Fin-snickare",
      "Byggentreprenad",
      "Bygg service",
      "Hustillverkare",
      "Betong/platta",
      "Flytspackel",
    ],
    path: "/professional/Construction_Concrete",
  },
  {
    title: "Mark & Schakt",
    image: "/images/consumer/service/2.png",
    resource: [
      "Asfalt",
      "Grävning -markarbete",
      "Trädgårdsplanering",
      "Stenspräckning",
      "Sprängning",
      "Grundläggning",
    ],
    path: "/professional/Land_Excavation",
  },
  {
    title: "Tak & Fasad",
    image: "/images/consumer/service/3.png",
    resource: ["Murare", "Plattsättare", "Fasadputs", "Plåtslagare"],
    path: "/professional/Yes_Fasad",
  },
  {
    title: "Installation",
    image: "/images/consumer/service/4.png",
    resource: [
      "Elektriker",
      "Rörmokare",
      "Ventilation",
      "Värmepumpinstallatör",
      "VA-justering",
      "Solcell",
      "Larm",
      "Kyl-installatör",
    ],
    path: "/professional/Installations",
  },
  {
    title: "Beläggning",
    image: "/images/consumer/service/5.png",
    resource: [
      "Mattläggare",
      "Målare",
      "Plattsättare",
      "Golvläggare",
      "Undertak",
      "Dekoration",
      "Epox-golv",
    ],
    path: "/professional/Coating",
  },
  {
    title: "Städ & fastighets -Underhåll",
    image: "/images/consumer/service/6.png",
    resource: [
      "Flyttstädning",
      "Fönsterputsning",
      "Sanering, klotter",
      "Golvård",
      "Fasadrengöring",
      "Kontors- hemstädning",
    ],
    path: "/professional/Cleaning_Maintenance",
  },
  {
    title: "Konsult & Arkitekt",
    image: "/images/consumer/service/7.png",
    resource: [
      "Arkitekt",
      "K-konsult",
      "VVS-konsult",
      "El-konsult",
      "Ljudkonsult",
      "Brandkonsult",
      "Ventilations - konsult",
      "Trädgårds arkitekt",
      "Kvalitetsansvarig",
      "Besiktning",
      "Utsättning",
    ],
    path: "/professional/Consultant_Architect",
  },
  {
    title: "Specialföretag",
    image: "/images/consumer/service/8.png",
    resource: [
      "Pålning",
      "Relining",
      "Fogning",
      "Balkongrenovering",
      "Sprutisolering",
      "Sanering, vaccum",
      "Rörspolning",
      "Trädfällning",
      "Bryggor",
      "Smide/stål",
      "Blästring",
    ],
    path: "/professional/Special_Company",
  },
];

export default function Service() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  // Get three visible images (with wrapping logic)
  const getVisibleItems = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      visible.push(services[(index + i + services.length) % services.length]);
    }
    return visible;
  };

  const visibleServices = getVisibleItems();
  const activeService = services[index];

  return (
    <div className="w-full px-4" id="industries">
      {/* Heading */}
      <div className="flex flex-col gap-4 items-center text-center">
        <h1 className="font-bold text-2xl md:text-3xl mt-20">
          Tjänster våra hantverkare erbjuder
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Hitta erfarna och pålitliga hantverkare i ditt närområde – snabbt,
          enkelt och tryggt.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-stretch">
        {/* Left column */}
        <div className="p-6 rounded-lg border bg-white shadow-sm flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-4">
            Hitta rätt hantverkare för ditt projekt – smidigt i TimeFlow System
          </h2>
          <p className="text-gray-600 mb-4">
            Ta reda på vilka yrkesgrupper i TimeFlow System som kan hjälpa dig
            vidare
          </p>
          <p className="font-medium">Vilken typ av proffs söker du hjälp av?</p>
        </div>

        {/* Middle column - 3 image carousel */}
        <div className="relative w-full h-[500px] overflow-hidden flex flex-col items-center justify-center bg-gray-50 rounded-xl shadow-md">
          {/* Top arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200 z-10"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-4 transition-transform duration-500 ease-in-out">
            {visibleServices.map((service, i) => {
              const isCenter = i === 1; // Middle item
              return (
                <div
                  key={i}
                  className={`relative transition-all duration-500 ${
                    isCenter
                      ? "scale-110 border-4 border-[#FF914D] shadow-lg"
                      : "scale-90 opacity-70"
                  } rounded-lg overflow-hidden w-[260px] h-[140px] bg-cover bg-center`}
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className="absolute top-2 left-2 bg-white text-black text-sm font-bold px-2 py-1 rounded-md">
                    {service.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom arrow */}
          <button
            onClick={handleNext}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-200 z-10"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Right column - Active service details */}
        <div className="p-6 rounded-lg bg-gray-100 flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4">{activeService.title}</h3>
          <ul className="space-y-2 mb-4 text-gray-700">
            {activeService.resource.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
          <a href={activeService.path}>
            <button className="bg-[#FF914D] text-white px-4 py-2 rounded-lg hover:bg-[#e67a33]">
              Läs mer →
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
