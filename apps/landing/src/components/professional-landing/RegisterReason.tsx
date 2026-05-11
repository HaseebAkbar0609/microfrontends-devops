import RegisterReason from "../common/register-reason";

const ProfessionalLandingRegisterReason: React.FC = () => {
  const data = [
    "Få nya kundleads direkt i systemet – inga externa listor eller manuella sök",
    "Få full kontroll över projket och order",
    "Hantera hela affären från förfrågan till avtal och faktura på ett ställe",
    "Arbeta effektivt med personal, maskiner och leverantörer i samma plattform rojekt, resurser och ekonomi",
    "Skapa digitala offerter och avtal snabbt – signeras enkelt med BankID",
    "Spara tid med automatiserade flöden och mallar",
    "Följ upp projektkvalitet med kundenkäter och avvikelserapportering",
    "Öka din lönsamhet med smarta kalkyler och prognosverktyg",
    "Integrera enkelt med fakturering, inköp och dokumenthantering",
  ];

  return (
    <div className="container mx-auto mt-10 md:mt-20 px-4 sm:px-8">
      <RegisterReason
        title="Därför ska du registrera dig i TimeFlowSystem"
        resource={data}
      />
    </div>
  );
};

export default ProfessionalLandingRegisterReason;
