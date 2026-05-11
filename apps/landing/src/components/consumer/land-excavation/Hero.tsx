import React from "react";
import Link from "next/link";


const LandExcavationHero: React.FC = () => {
  return (
    <section className="relative bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-4 py-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Smidig mark- och schaktlösning för dig som privatperson – allt i ett system
          </h1>
          <p className="text-gray-600 mb-6 font-bold">
            TimeFlow System gör mark- och schaktarbetet smidigt, lönsamt och fullt spårbart.
            Spara tid och spara pengar.
          </p>
          <p className="text-gray-600 mb-6">Från första offert till färdigt arbete – med TimeFlow System får du full kontroll på ditt mark- och schaktprojekt. Jämför offerter, följ arbetet i realtid och hantera allt digitalt: avtal, fakturor, uppdateringar och godkännanden. Du sparar tid, undviker misstag och får en trygg, effektiv lösning från start till mål.</p>
          <Link href="https://timeflowsystem.com/register/customer" className="bg-[#FF914D] hover:bg-[#E0712D] text-white px-6 py-3 rounded-xl transition inline-block text-center">
            Skapa konto
          </Link>
        </div>
        <div>
          {/* Video embed (desktop) */}
            <div className="relative flex-2/5">
              <div style={{ position: "relative", aspectRatio: "16/9" }}>
                <iframe
                  loading="lazy"
                  title="Gumlet video player"
                  src="https://play.gumlet.io/embed/68f1eb226b5c1015aceee6b7"
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
    </section>
  );
};

export default LandExcavationHero;
