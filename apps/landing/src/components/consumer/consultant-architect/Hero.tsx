import React from "react";
import Link from "next/link";

const ConsultantArchitectHero: React.FC = () => {
  return (
    <section className="relative bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-4 py-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Hitta rätt arkitekt eller konsult – smart, tryggt och kostnadseffektivt med TimeFlow
          </h1>
          <p className="text-gray-600 mb-6">
            <span className="font-bold">Tryggare projekt med rätt arkitekt eller konsult <br></br></span> 
            Få bättre överblick, tydlig kommunikation och en smidigare resa från idé till färdigt resultat.
          </p>
          <p className="text-gray-600 mb-5">Duktiga konsulter och arkitekter – redo att hjälpa dig via TimeFlow Hos oss hittar du erfarna och kvalitetssäkrade experter som guidar dig genom hela projektet – smidigt, tryggt och professionellt från start till mål.</p>
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
                  src="https://play.gumlet.io/embed/68f1ec016b5c1015aceefb53"
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

export default ConsultantArchitectHero;
