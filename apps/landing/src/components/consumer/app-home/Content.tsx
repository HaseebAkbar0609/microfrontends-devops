import React from "react";
import Link from "next/link";

const ProfessionalHomeContent: React.FC = () => {
  return (
    <div className="container mx-auto">
      {/* Intro Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20 bg-[#F2F2F2] px-20 py-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            TimeFlow Home
          </h2>
          <p className="text-gray-700 mb-6">
            Med TimeFlow Home kan du lägga upp jobb, se vem som skickar offerter
            och via projektverktyget hantera ditt projekt med tidssplan, egenkontroller,
            ekonomi, ändrings- & tilläggsarbeten, protokoll, fråga och svar, och handlingar.
            Allt sker smidigt i mobilappen.
          </p>
          <Link href="https://timeflowsystem.com/register/customer" className="bg-[#FF914D] hover:bg-[#E0712D] text-white px-6 py-3 rounded-xl transition inline-block text-center">
            Skapa konto
          </Link>
        </div>

        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759379231/App_TimeFlow_Home_1_zoleef.png"
            alt="App preview"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center px-20">
        {/* Left Column (text) */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Fördelar med TimeFlow Home - din app för smidiga bygg- och renoveringsprojekt
          </h2>

          <ul className="space-y-6 text-gray-700">
            {[
              {
                title: "Samla allt på ett ställe",
                text: "Håll koll på tidssplan, budget, offerter och tilläggsarbeten – utan papper eller mejltrådar.",
              },
              {
                title: "Jämför offerter och skapa egna förfrågningar",
                text: "Skicka ut offertförfrågningar direkt via appen och jämför svaren från olika hantverkare – snabbt, smidigt och kostnadseffektivt.",
              },
              {
                title: "Följ projektet i realtid",
                text: "Få en visuell översikt över projektets status, planerade moment och eventuella förseningar. Inga fler gissningar – du ser exakt var projektet befinner sig.",
              },
              {
                title: "Tilläggsarbeten hanteras enkelt",
                text: "Behöver något läggas till under arbetets gång? Du får tydlig information och kan godkänna tilläggen direkt i appen – inget faller mellan stolarna.",
              },
              {
                title: "Effektiv kommunikation med din hantverkare",
                text: "Ställ frågor, ta del av mötesprotokoll, ladda upp och svara på alla viktiga besked samlade på ett ställe. Inga fler missförstånd – all dokumentation på plats.",
              },
              {
                title: "Trygghet och struktur hela vägen",
                text: "Med TimeFlow Home får du kontroll, transparens och ett verktyg som minskar risken för konflikter, förseningar eller dolda kostnader.",
              },
              {
                title: "Vill du veta mer?",
                text: "Titta på vår korta introduktionsvideo och se hur enkelt det är att hantera ditt projekt med TimeFlow Home.",
              },
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-[#FF914D] mt-1">✔</span>
                <div>
                  <h3 className="font-semibold text-[#FF914D]">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column (image / video placeholder) */}
        	{/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f1eb22befe20b134d3d937"
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
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHomeContent;
