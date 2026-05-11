import React from "react";
import Link from "next/link";

const CleaningMaintenanceHero: React.FC = () => {
  return (
    <section className="relative bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-4 py-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
           Trygg och effektiv städ- och underhållshjälp – direkt i TimeFlow
          </h1>
          <p className="text-gray-600 mb-6">
            <span className="font-bold">Få full kontroll på städ- och underhållsarbetet – enkelt och tryggt med TimeFlow <br></br></span> 
            Som privatperson får du översikt, tydlig kommunikation och smidig hantering av hela uppdraget – allt digitalt på ett ställe.
          </p>
          <p className="text-[#5B5B5B] mb-5">Städ- och underhållshjälp – enkelt och digitalt med TimeFlow Följ uppdrag och kommunikation direkt i mobilen – smidigt, tydligt och tryggt.</p>
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
                  src="https://play.gumlet.io/embed/68f1eb23558b404636e47697"
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

export default CleaningMaintenanceHero;
