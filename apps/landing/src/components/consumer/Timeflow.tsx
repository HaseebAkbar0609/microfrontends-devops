"use client";

import { useState, useEffect } from "react";
import Blog from "../common/blog";
import Button from "../common/button";
import { Check, RightArrow } from "../icons";
import Link from "next/link";
import { getCustomerRegisterUrl } from "@/utils/constants";

const Timeflow: React.FC = () => {
  const [customerRegisterUrl, setCustomerRegisterUrl] = useState<string>("#");

  useEffect(() => {
    setCustomerRegisterUrl(getCustomerRegisterUrl());
  }, []);
  const data = [
    "Se inkommande offerter och vilka hantverkare som visar intresse för ditt projekt.",
    "Få notiser i realtid vid uppdateringar och nya meddelanden.",
    "Följ projektets alla steg - från start till färdigställande - med full överblick.",
    "Kommunicera smidigt med hantverkare och få snabbare svar.",
    "Hantera tilläggsarbeten enkelt och transparent.",
    "Granska egenkontroller med både bilder och kommentarer.",
    "Följ upp tidsplaner och budget för att undvika förseningar och oväntade kostnader.",
    "Spara tid och minska stress - samtidigt som du säkrar kvalitet och kostnadskontroll.",
  ];

  return (
    <div className="container mx-auto px-4 mt-10 md:mt-20">
      <p className="header-primary-size font-bold text-center">
        Timeflow Home - mobil appen
      </p>

      <div className="mt-8">
        <Blog
          image="/images/consumer/timeflow/1.png"
          title={
            <div className="flex flex-col gap-2">
              <p className="header-secondary-size font-bold">
                Kom åt ditt projekt – även när du är på språng.
              </p>
              <p className="content-primary-size">Mobilapp TimeFlow - Home</p>
            </div>
          }
          description={
            <div className="grow flex flex-col gap-2 content-primary-size mt-6">
              <p className="font-bold">
                Få full kontroll över dina projekt - direkt i mobilen
              </p>
              <p className="text-[#5B5B5B]">
                Med TimeFlows mobilapp har du alltid full översikt över ditt
                projekt, var du än är. Allt samlat i ett lättanvänt verktyg:
              </p>
              <ul className="list-none">
                {data.map((item, key) => (
                  <li
                    key={key}
                    className="py-2 text-sm relative pl-6 flex items-start gap-2"
                  >
                    <span className="w-6 h-6 shrink-0">
                      <Check />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold">
                TimeFlow - Allt samlat. Alltid tillgängligt.
              </p>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={customerRegisterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button round="full" className="flex gap-2 items-center">
                    <span className="text-[#0C0C0D]">Registrera ditt projekt</span>
                    <RightArrow />
                  </Button>
                </a>

                <Link href="/consumer/app-home">
                  <Button>Läs mer</Button>
                </Link>
              </div>

            </div>
          }
        />
      </div>
    </div>
  );
};

export default Timeflow;
