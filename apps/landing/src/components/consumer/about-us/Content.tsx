import { Quote, RightQuote } from "@/components/icons";

const ConsumerAboutUsContent: React.FC = () => {
  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="relative grid md:grid-cols-2 gap-4 bg-[#F2F2F2] justify-center items-center px-4 md:px-8 py-4">
          <div className="flex flex-col gap-4 footer-title-size text-[#5B5B5B]">
            <p>
              Vi utvecklar projektverktyg, leadsfunktioner och affärssystem för
              konsument- och hantverks-branschen.
            </p>
            <p>
              Bolaget är verksamt i Estland och Sverige med vidare expansion i
              Europa och Amerika.
            </p>
            <p>
              Verksamheten kännetecknas av en hög teknisk kunskap och erfarenhet
              inom hantverksyrkena.
            </p>
          </div>
          <div className="p-4">
            <img
              className="w-full h-auto"
              src="/images/consumer/about-us/content/1.png"
            />
          </div>

          <div className="absolute top-9 left-4 w-10 h-10 rotate">
            <RightQuote />
          </div>
        </div>
        <div className="flex flex-col">
          	{/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f1eb226b5c1015aceee6b4"
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
          <p className="font-bold header-primary-size mt-3">
            Låt oss visa vilka vi är
          </p>
          <p className="footer-title-size text-[#5B5B5B] mt-5">
            Titta på vår film och lär känna TimeFlow – vad vi står för, hur vi
            tänker och hur vi förenklar vardagen för dig som privatperson.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsumerAboutUsContent;
