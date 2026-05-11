import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  B2B,
  Balance,
  Building,
  Calculator,
  Calendar,
  Clipboard,
  Cloud,
  Collection,
  Compass,
  Cup,
  DollarSign,
  Folder,
  People,
  Receipt,
  SearchCurrency,
  Setting,
  ShoppingCart,
  Sun,
  Temperature,
  ThumbUp,
} from "@/components/icons";

/* ▶ Play Button */
const PlayButton = () => (
  <div className="w-8 h-8 flex items-center justify-center bg-[#FF914D] rounded-full flex-shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

interface ModuleItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
}

/* ✅ Modules Data (from first code) */
const modules: ModuleItem[] = [
  { label: "OFFERT", icon: <ThumbUp />, path: "/professional/offer" },
  { label: "B2B", icon: <B2B />, path: "/professional/B2b_page" },
  { label: "KALKYL", icon: <Calculator />, path: "/professional/Calculation" },

  { label: "PROJEKTERING", icon: <Compass />, path: "/professional/Project_Design" },
  { label: "KMA", icon: <Cup />, path: "/professional/KMA" },
  { label: "ORDER", icon: <Clipboard />, path: "/professional/Order" },
  { label: "PROJEKT", icon: <Folder />, path: "/professional/Project" },
  { label: "INKÖP", icon: <ShoppingCart />, path: "/professional/Purchase" },
  { label: "MATERAIL - LAGER", icon: <Setting />, path: "/professional/Machine" },
  { label: "FORDON", icon: <Setting />, path: "/professional/Machine" },
  { label: "MASKIN", icon: <Setting />, path: "/professional/Machine" },
  { label: "ÅTKOMST", icon: <Setting />, path: "/professional/Machine" },

  { label: "EKONOMI", icon: <DollarSign />, path: "/professional/Economy" },
  { label: "FAKTURA", icon: <Receipt />, path: "/professional/Invoice" },
  { label: "PROGNOS", icon: <Temperature />, path: "/professional/Forecast" },
  { label: "PERSONAL", icon: <People />, path: "/professional/Personal" },
  { label: "INKASSO", icon: <Collection />, path: "/professional/Collection" },
  { label: "JURIDIK", icon: <Balance />, path: "/professional/Legal" },

  { label: "AVTAL", icon: <Calendar />, path: "/professional/Agreement" },
  { label: "MALLAR", icon: <Building />, path: "/professional/Goods" },
  { label: "MARKNAD-SÄLJ", icon: <SearchCurrency />, path: "/professional/Market" },
  { label: "DATA - IT", icon: <Cloud />, path: "/professional/Data" },
  { label: "LEDNINGSSTÖD", icon: <Sun />, path: "/professional/Management" },
];

const SystemOverviewContent: React.FC = () => {
  return (
    <div className="w-full">
      
      {/* HERO SECTION */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center bg-white rounded-2xl p-10 shadow">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Se hur Timeflowsystem fungerar
          </h1>
          <p className="text-gray-600 mb-6">
            Utforska vårt system och lär dig hur varje modul fungerar
          </p>

          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg"
              className="rounded-xl"
              alt="Video preview"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-[#FF7A00]">
              Se hela vårt system
            </Button>
            <Button className="bg-[#FF7A00]">
              Utforska funktioner →
            </Button>
          </div>
        </div>
      </section>

      {/* MODULE PREVIEW */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Välj modul och lär dig mer om:
        </h2>
        <p className="text-gray-600 mb-10">
          Utforska vårt system och lär dig hur varje modul fungerar
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {["Tidrapportering", "Projekt", "Fakturering", "KMA"].map((item, i) => (
            <div key={i}>
              <img
                src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1757421884/f6a868c17aa9c0904c219b86fc6dbff3b7994210_1_ve0vhz.jpg"
                className="rounded-lg mx-auto mb-3"
                alt={item}
              />
              <h3 className="font-semibold">{item}</h3>
              <p className="text-sm text-gray-500">Beskrivning här</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-semibold text-gray-700 cursor-pointer">
          Mer Moduler →
        </p>
      </section>

      {/* APPS */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold">
          Appar anpassade för din roll
        </h2>
        <p className="text-gray-600 mb-10">
          Rätt verktyg för rätt roll - i samma system
        </p>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
          {/* Work */}
          <div>
            <h3 className="font-bold mb-4">Timeflow Work</h3>
            <img
              src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1754326813/18c04ebc03020f8a99e1d3c89db09975a83ce402_zcvtcl.png"
              className="mx-auto mb-4"
              alt="Timeflow Work"
            />
            <h4 className="font-semibold">För arbetare</h4>
            <p className="text-gray-600 text-sm">
              Smidig tidrapportering och kvalitetshantering
            </p>
          </div>

          {/* Manager */}
          <div>
            <h3 className="font-bold mb-4">Timeflow Manager</h3>
            <img
              src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1754326813/18c04ebc03020f8a99e1d3c89db09975a83ce402_zcvtcl.png"
              className="mx-auto mb-4"
              alt="Timeflow Manager"
            />
            <h4 className="font-semibold">För arbetsledning</h4>
            <p className="text-gray-600 text-sm">
              Uppföljning och kontroll i realtid
            </p>
          </div>
        </div>
      </section>

      {/* ✅ INSTRUCTION VIDEOS (UPDATED) */}
      <section className="bg-gray-300 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">
            Instruktionsvideor
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {modules.map((item, i) => {
              const card = (
                <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between hover:border hover:border-[#FF914D] transition cursor-pointer shadow-sm">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center text-gray-800">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>

                  <PlayButton />
                </div>
              );

              return item.path ? (
                <Link key={i} href={item.path}>
                  {card}
                </Link>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default SystemOverviewContent;