import Link from "next/link";
import { useState } from "react";
import Button from "../common/button";

const SaveTime: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  const data = [
    { label: "Årlig intäktsökning", value: "11%" },
    { label: "Potentiell årlig intäktsökning", value: "550.000 kronor" },
    { label: "Årlig vinstökning %", value: "21%" },
    { label: "Rimlig vinstökning", value: "480.000 kronor" },
  ];

  return (
    <div className="bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-10 md:py-20">
        <h1 className="font-bold text-3xl md:text-4xl text-center">
          Spara tid med TimeFlow
        </h1>
        <p className="mt-4 text-lg text-[#5B5B5B] text-center">
          Hur mycket tid kan du spara med TimeFlow? Prova vår ROI-kalkylator
        </p>

        <div className="mt-10 flex flex-col lg:flex-row gap-6">
          {/* Vänster sida */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-[#5B5B5B]">ROI-KALKYLATOR</p>
            <h2 className="mt-2 text-2xl font-semibold">
              Beräkna din uppskattade avkastning på investeringen
            </h2>
            <p className="mt-6 text-[#5B5B5B]">
              Hur mycket potentiell avkastning på resultat (ROI) kan du få med
              TimeFlowsystem? Låt oss ta reda på det
            </p>

            {/* Link to /professional/pricing */}
            <Link href="/professional/roi_calculator">
              <Button className="mt-8 font-semibold text-sm">
                Uppskatta din avkastning på investeringen testa här
              </Button>
            </Link>
          </div>

          {/* Höger sida */}
          <div className="flex-1 flex flex-col px-5 py-10 bg-white rounded-lg shadow-md [&>*:nth-child(odd)]:bg-[#F5F5F5]">
            {data.map((item, key) => (
              <div
                key={key}
                className="flex justify-between items-center px-5 py-3"
              >
                <div className="text-base font-medium">{item.label}</div>
                <div className="text-base text-[#5B5B5B]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTime;
