const ProfessionalHowItWorksContent: React.FC = () => {
  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Kom igång med TimeFlow System - enkelt och smidigt
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Som hantverksföretag skapar ni snabbt ett konto genom att
              registrera er och välja den prisplan som passar er verksamhet.
              Direkt efter registrering får ni tillgång till TimeFlow System och
              kan börja arbeta i plattformen - ta emot leads, hantera projekt
              och effektivisera hela arbetsflödet.
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Systemet finns i tre versioner: Start, Standard och PRO. Ni kan
              när som helst uppgradera er plan eller lägga till fler användare
              genom att köpa extra licenser - helt flexibelt efter era behov.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Ladda ner vår mobilapp - TimeFlow Work
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Appen TimeFlow Work finns tillgänglig på både App Store och Google
              Play. Med appen kan ni och era medarbetare enkelt registrera tid,
              hantera utgifter, följa upp projektstatus och utföra
              arbetsuppgifter direkt från fältet.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Hantera inställningar och kom igång snabbt
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Som administratör har ni full kontroll över ert konto och alla
              grundinställningar i systemet. Ni kan enkelt importera
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Hantera inställningar och kom igång snabbt
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Som administratör har ni full kontroll över ert konto och alla
              grundinställningar i systemet. Ni kan enkelt importera
            </p>
            <ul className="font-[#5B5B5B] content-secondary-size pl-8 list-disc">
              <li>Kundregister</li>
              <li>Leverantörsregister</li>
              <li>Kontoplaner</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Smidig betalning och flexibel administration
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Licenser och systemkostnader debiteras automatiskt via det
              betalkort ni angav vid registreringen. Ni kan när som helst
              uppdatera era betalningsuppgifter eller hantera kontoinställningar
              via administrationspanelen.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-bold text-primary-500 header-secondary-size">
              Tillgänglig support och hjälpcenter
            </p>
            <p className="text-[#5B5B5B] content-secondary-size">
              Behöver ni hjälp? Vårt supportteam och hjälpcenter finns direkt
              tillgängliga i systemet så att ni alltid har tillgång till
              vägledning när ni behöver det.
            </p>
          </div>
        </div>

        <div className="">
          <img
            className="w-full h-auto"
            src={"/images/professional/howitworks/content/1.png"}
            alt="content_1.png"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHowItWorksContent;
