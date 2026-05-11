import {
  CompareTool,
  DrivingJournal,
  Industry,
  MoreBusiness,
  Profitability,
  SaveTime,
  Security,
  SmartApp,
  System,
} from "../icons";

const ProfessionalIntroduction: React.FC = () => {
  const data = [
    {
      label: "Ökad lönsamhet",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <Profitability />
        </div>
      ),
    },
    {
      label: "SecureCheck funktion",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <Security />
        </div>
      ),
    },
    {
      label: "Drive - Körjournal",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <DrivingJournal />
        </div>
      ),
    },
    {
      label: "Få fler affärer",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <MoreBusiness />
        </div>
      ),
    },
    {
      label: "Allt samlat i ett system",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <System />
        </div>
      ),
    },
    {
      label: "Spar tid",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <SaveTime />
        </div>
      ),
    },
    {
      label: "Smart app för fältet ",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <SmartApp />
        </div>
      ),
    },
    {
      label: "Jämför projektverktyg",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <CompareTool />
        </div>
      ),
    },
    {
      label: "Branschanpassat",
      icon: (
        <div className="w-12 md:w-14 xl:w-16 ">
          <Industry />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-15 px-4">
      <h1 className="font-bold  header-primary-size text-center">
        Varför TimeFlow ?
      </h1>
      <p className="text-[#5B5B5B] content-primary-size mt-6 text-center">
        Smarta verktyg i samverkan gör TimeFlow till marknadens mest kompletta
        lösning
      </p>
      <div className="mt-4 py-6 grid lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item, key) => (
            <div key={key} className="flex flex-col items-center">
              {item.icon}
              <p className="text-[#5B5B5B] mt-4 text-center">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          {/* Video embed (desktop) */}
          <div className="relative flex-2/5">
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              <iframe
                loading="lazy"
                title="Gumlet video player"
                src="https://play.gumlet.io/embed/68f639d1befe20b1340a7ee4"
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

export default ProfessionalIntroduction;
