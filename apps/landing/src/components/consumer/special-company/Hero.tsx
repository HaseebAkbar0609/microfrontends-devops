import React from "react";
import Link from "next/link";


const SpecialCompanyHero: React.FC = () => {
  return (
    <section className="relative bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-4 py-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
           Anlita rätt nischföretag – specialisthjälp till rätt pris med full kontroll i TimeFlow
          </h1>
          <p className="text-gray-600 mb-6">
            {/* <span className="font-bold">Spara tid, minska fel och få full kontroll <br></br></span>  */}
            Hitta rätt specialist för ditt projekt – direkt i TimeFlow Vi har duktiga och kvalitetssäkrade nischföretag anslutna inom olika delar av hantverksbranschen, redo att hjälpa dig med just dina behov – tryggt och enkelt från start till klart.
          </p>
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
                  src="https://play.gumlet.io/embed/68f1ec166b5c1015aceefd81"
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

export default SpecialCompanyHero;
