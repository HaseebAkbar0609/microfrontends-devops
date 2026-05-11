import { CheckCircle } from "lucide-react";

const ProfessionalProjectToolsContent: React.FC = () => {
  return (
    <div className="w-full">
      {/* Content Wrapper */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Title Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            TimeFlow System – Projektverktyg för Privatpersoner
          </h2>
          <p className="text-gray-600 text-lg">
            Få full kontroll över ditt bygg- eller renoveringsprojekt – direkt i din
            egen dashboard.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left – Dashboard Image */}
          <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759288231/Screenshot_2025-10-01_084011_fej5yq.png"
              alt="Projekt Dashboard"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
          </div>

          {/* Right – Features */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Funktioner som ingår:
            </h3>
            <ul className="space-y-3">
              {[
                "Tidsplan",
                "Budget",
                "Kontrollplan",
                "Dokument & Ritningar",
                "Organisationsplan",
                "Fakturor",
                "Ändrings- & Tilläggsarbeten",
                "Besiktningar",
                "Fråga & Svar",
                "Flera projekt samtidigt",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-800">
                  <CheckCircle className="text-[#FF7A00] w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left – Reasons */}
          <div>
            <h3 className="text-3xl font-bold mb-6">
              Varför välja TimeFlow?
            </h3>
            <ul className="space-y-5 text-gray-700 text-lg">
              {[
                "Du slipper hålla ordning på utspridda mejl, sms och papperslappar",
                "Få full överblick över ditt projekt – direkt i din dashboard",
                "Följ och hantera varje steg i ditt bygg- eller renoveringsprojekt enkelt",
                "Se status, kommunicera med entreprenörer, ladda upp dokument och håll koll på tidplan och kostnader – allt på ett ställe",
              ].map((reason, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-[#FF7A00] w-5 h-5 mt-1" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          	{/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f1eb226b5c1015aceee6b0"
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
    </div>
  );
};

export default ProfessionalProjectToolsContent;
