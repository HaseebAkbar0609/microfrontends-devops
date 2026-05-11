import Blog from "../common/blog";

const ProfessionalLandingAboutUs: React.FC = () => {
  return (
    <div className="container mx-auto mt-10 md:mt-20 px-4 sm:px-8">
      <div className="relative border border-primary-500 rounded-2xl">
        <Blog
          title={
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center justify-center md:justify-start">
                <p className="header-primary-size font-bold">Om oss</p>
                <div className="">
                  <span className="text-xs bg-primary-500 text-white rounded-r-2xl py-2 px-4">
                    Professional
                  </span>
                </div>
              </div>
              <p className="header-secondary-size text-[#5B5B5B]">
                Få fler kunder – direkt i ditt projektverktyg
              </p>
            </div>
          }
          description={
            <div className="flex flex-col gap-4 content-primary-size">
              <p className="text-[#5B5B5B]">
                TimeFlowSystem är mer än ett traditionellt projektsystem – det
                är din genväg till nya affärer. Med inbyggd leadshantering och
                smart kundbearbetning hjälper vi dig att hitta, följa upp och
                vinna nya kunder på ett enkelt och effektivt sätt.
              </p>
              <p className="text-[#5B5B5B]">
                Ett projektverktyg som sparar tid och lyfter din lönsamhet –
                allt i ett för hantverksbranschen. Du får full överblick, bättre
                struktur och fler affärer – utan att hoppa mellan olika system.
              </p>
              <p className="font-bold">
                Redo att ta nästa steg? Skapa ditt konto och börja få leads
                redan idag.
              </p>
              <p className="font-bold">
                Registrera dig gratis – kom igång på några minuter!
              </p>
            </div>
          }
          image="/images/professional-landing/about-us/1.png"
        />
      </div>
    </div>
  );
};

export default ProfessionalLandingAboutUs;
