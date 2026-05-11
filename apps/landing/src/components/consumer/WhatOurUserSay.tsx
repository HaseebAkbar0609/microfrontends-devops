import IntroBlog from "../common/intro-blog";
import { Clock, Forecast, Manual, Phone, PuzzlePiece, Support } from "../icons";

const WhatOurUserSay: React.FC = () => {
  const data = [
    {
      title: `“Proffsiga hantverkare"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">
            Enkelt att skapa konto och söka efter hantverkare
          </p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Vi skapade kontot enkelt och få ganska omgående kontakt med
              hantverkare
            </p>
            <p className="content-secondary-size">Anders, Villaägare</p>
          </div>
        </>
      ),
      icon: <Manual />,
    },
    {
      title: `“Enkelt att komma igång"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">Digitalt avtal</p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Skrivningen av kontrakt var enkelt med den digitala funktionen
            </p>
            <p className="content-secondary-size">Jose, Bostadsrättsägare</p>
          </div>
        </>
      ),
      icon: <Support />,
    },
    {
      title: `“Så smidigt"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">Flera användare</p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Min fru blev användare också i projektet, så vi kunde tillsammans
              fatta beslut och följa projektet.
            </p>
            <p className="content-secondary-size">Karin, Villaägare</p>
          </div>
        </>
      ),
      icon: <Clock />,
    },
    {
      title: `“Skönt ha allt samlat"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">Ett system</p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Få offert, arkivera, och hantera projekt på en plattform och
              samtidigt kunna kommunicera med hantverkaren är det som gör
              TimeFlow unik
            </p>
            <p className="content-secondary-size">Stefan, BRF-ordförande</p>
          </div>
        </>
      ),
      icon: <PuzzlePiece />,
    },
    {
      title: `“Fick bra hjälp"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">
            Ombyggnad badrum
          </p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Det var verkligen komptenta och verifierade hantverkare hos oss,
              märks att det är ett proffsverktyg.
            </p>
            <p className="content-secondary-size">Mirza , Radhusägare</p>
          </div>
        </>
      ),
      icon: <Phone />,
    },
    {
      title: `“Bra Projektverktyg"`,
      description: (
        <>
          <p className="text-[#5B5B5B] group-hover:text-[#0c0c0d] content-secondary-size">Projektverktyg</p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <p className="mt-3 content-secondary-size">
              Kunna administrera ett projekt gratis som privatperson är det vi
              har letat efter, bra jobbat.
            </p>
            <p className="content-secondary-size">Anna-Karin, Sommarstugeägare</p>
          </div>
        </>
      ),
      icon: <Forecast />,
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-10 md:mt-20">
      <IntroBlog
        data={data}
        title="Vad våra användare säger"
        description="TimeFlow har hjälpt många att få jobbet gjort på ett tryggt och enkelt sätt"
      />
    </div>
  );
};

export default WhatOurUserSay;
