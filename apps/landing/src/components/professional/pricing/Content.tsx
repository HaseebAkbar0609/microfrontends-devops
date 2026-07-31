"use client";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const plans = [
  {
    title: "Free plan",
    price: 0,
    priceText: "0 SEK",
    buttonText: "Välj denna",
    features: [
      "Full tillgång till TimeFlow system",
      "Användare: Obegränsat",
      "Kräver registrering och kort",
      "Funktioner: Samtliga moduler, ej app-Work",
    ],
  },
  {
    title: "START Platform",
    basePrice: 2995,
    licensePrice: 0,
    buttonText: "Välj denna",
    features: [
      "Grundavgift 2995 SEK / månaden",
      "Användare: Obegränsat",
      "Bindningstid 3 månader eller årsplan med 2 månader gratis",
      "Funktioner: Offert, B2B, Faktura, CMS, Mina sidor, App-Work Start, obegränsat",
    ],
  },
  {
    title: "STANDARD",
    basePrice: 2995,
    licensePrice: 995,
    buttonText: "Välj denna",
    hasCounter: true,
    features: [
      "Grundavgift 2995 SEK / månaden",
      "Licenskostnad 995 SEK / användare",
      "Bindningstid 3 månader eller årsplan med 2 månader gratis",
      "Funktioner: Allt i Start, Kalkyl, Order, Projekt, KMA, Ekonomi, Personal, Maskin, Mallar",
      "App-Manager ingår",
    ],
  },
  {
    title: "PRO",
    basePrice: 2995,
    licensePrice: 1295,
    buttonText: "Välj denna",
    hasCounter: true,
    features: [
      "Grundavgift 2995 SEK / månaden",
      "Licenskostnad 1295 SEK / användare",
      "Bindningstid 3 månader eller årsplan med 2 månader gratis",
      "Funktioner: Allt i Standard + Inköp, Avtal, Data/IT, Marknad, Juridik, Inkasso, Prognos, Projektering, Företagsledning",
      "App-Manager ingår",
    ],
  },
];

const ProfessionalPricing2Content: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language || "sv-SE";
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    STANDARD: 1,
    PRO: 1,
  });

  const handleChange = (plan: string, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [plan]: Math.max(1, (prev[plan] || 1) + delta),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Intro */}
      <div className="text-center mb-12 bg-[#F2F2F2] p-6 rounded-2xl max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">
          En enkel lösning för entreprenörer i hantverksbranschen
        </h2>
        <p className="text-gray-600 mt-2">
          Det enkla sättet att hantera dina projekt, kunder och din verksamhet – allt på ett och samma ställe.
        </p>
        <p className="mt-2 text-gray-700 font-medium">
          Smarta verktyg för att göra kunderna nöjda och <br /> förenkla arbetsflödena
        </p>
      </div>

      {/* Header */}
      <h3 className="text-center text-2xl font-semibold mb-5">
        Välj betalningsalternativ
      </h3>
      <p className="text-center text-gray-500 mb-8 text-sm max-w-3xl mx-auto">
        Kvartalsbetalning ger 5% rabatt. Årsbetalning ger 2 månader gratis
        (motsvarar 17% rabatt). Gäller grundavgift och licenser.
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const count = counts[plan.title] ?? 1;

          let finalPrice = 0;

          if (plan.title === "Free plan") {
            finalPrice = 0;
          } else if (plan.hasCounter) {
            finalPrice =
              (plan.basePrice || 0) +
              (plan.licensePrice || 0) * count;
          } else {
            finalPrice = plan.basePrice || plan.price || 0;
          }

          return (
            <div
              key={index}
              className={`rounded-2xl shadow-lg p-6 flex flex-col justify-between ${
                index === 0 ? "bg-white border" : "bg-[#fff9f5]"
              }`}
            >
              <div>
                <h3 className="text-xl font-bold mb-3">{plan.title}</h3>

                {/* Price */}
                <p className="text-3xl font-bold text-[#FF914D] mb-4">
                  {plan.title === "Free plan"
                    ? plan.priceText
                    : `${finalPrice.toLocaleString(currentLocale)} SEK/mån`}
                </p>

                {/* Features */}
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF914D]">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Counter */}
              {plan.hasCounter && (
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="px-3 py-1 border rounded text-xl font-bold"
                      onClick={() => handleChange(plan.title, -1)}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{count}</span>
                    <button
                      className="px-3 py-1 border rounded text-xl font-bold"
                      onClick={() => handleChange(plan.title, +1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Price breakdown */}
                  <div className="text-sm text-center mt-3 text-gray-600">
                    <p>Grund avgift: {(plan.basePrice || 0).toLocaleString(currentLocale)} SEK</p>
                    <p>
                      Licens: {(plan.licensePrice || 0).toLocaleString(currentLocale)} SEK / användare
                    </p>
                    <p className="font-semibold">
                      Totalt: {finalPrice.toLocaleString(currentLocale)} SEK / mån
                    </p>
                  </div>
                </div>
              )}

              {/* Button */}
              <Link
                href="https://timeflowsystem.com/register/member"
                className="mt-6 w-full bg-[#FF914D] hover:bg-[#e57f39] text-white font-semibold py-3 rounded-lg transition text-center block"
              >
                {plan.buttonText}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalPricing2Content;