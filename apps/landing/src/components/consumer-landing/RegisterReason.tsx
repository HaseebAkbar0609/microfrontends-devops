import RegisterReason from "../common/register-reason";

const ConsumerLandingRegisterReason: React.FC = () => {
  const data = [
    "Enkelt att hitta och jämföra seriösa hantverkare i ditt område",
    "Signera tryggt med BankID - inga lösa papperskontrakt",
    "Skicka förfrågningar och få offerter - direkt via systemet",
    "Säkrare ROT-/RUT-hantering och korrekt underlag till Skatteverket",
    "Följ hela projektet digitalt – från start till färdigställande",
    "Dokumentation, bilder och protokoll samlas på ett ställe",
    "Få tydliga avtal och kostnadsuppskattningar innan arbetet börjar",
    "Lämna omdöme och bidra till bättre kvalitet i branschen",
  ];

  return (
    <div className="container mx-auto mt-10 md:mt-20 px-4">
      <RegisterReason
        title="Därför ska du registrera dig i TimeFlowSystem"
        resource={data}
      />
    </div>
  );
};

export default ConsumerLandingRegisterReason;
