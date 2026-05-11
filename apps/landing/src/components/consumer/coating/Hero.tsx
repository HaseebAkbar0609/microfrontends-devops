import React from "react";
import Link from "next/link";

const CoatingHero: React.FC = () => {
  return (
    <section className="relative bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-4 py-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Rätt beläggning till rätt pris – med total kontroll genom hela projektet
          </h1>
          <p className="text-gray-600 mb-6">
            <span className="font-semibold">
              Enklare beläggningsprojekt med smart planering, högre precision och full kontroll över hela ytan.
            </span>
            <br />
            Smidiga beläggningsprojekt – digitalt och enkelt med TimeFlow för full koll på offerter, framdrift, mätresultat och kommunikation med entreprenören – direkt i mobilen, utan krångel.
          </p>
          <Link
            href="https://timeflowsystem.com/register/customer"
            className="bg-[#FF914D] hover:bg-[#E0712D] text-white px-6 py-3 rounded-xl transition inline-block text-center"
          >
            Börja här
          </Link>
        </div>
        <div>
          <div className="relative flex-2/5">
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              <iframe
                loading="lazy"
                title="Gumlet video player"
                src="https://play.gumlet.io/embed/68f1eb23558b404636e47675"
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

export default CoatingHero;
