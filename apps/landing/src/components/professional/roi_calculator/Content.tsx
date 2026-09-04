"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const services = [
  {
    title: "Bygg & Betong",
    resource: [
      "Snickare",
      "Fin-snickare",
      "Bygg entreprenad",
      "Bygg service",
      "Hustillverkare",
      "Betong/platta",
      "Flytspackel",
    ],
    path: "/professional/Construction_Concrete",
  },
  {
    title: "Installation",
    resource: [
      "Elektriker",
      "Rörmokare",
      "Ventilation",
      "Värmepumpinstallatör",
      "VA-justering",
      "Solcell",
      "Larm",
      "Kyl-installatör",
    ],
    path: "/professional/Installations",
  },
  {
    title: "Tak & Fasad",
    resource: ["Murare", "Plattsättare", "Fasadputs", "Plåtslagare"],
    path: "/professional/Yes_Fasad",
  },
  {
    title: "Mark & Asfalt",
    resource: ["Asfaltläggare", "Markarbetare", "Stenläggare"],
    path: "/professional/Paving",
  },
  {
    title: "Konsult & Arkitekt",
    resource: ["Arkitekt", "Konstruktör", "Projektledare"],
    path: "/professional/Consulting_Architecture",
  },
  {
    title: "Städ & Facility Management",
    resource: ["Städare", "Facility Manager", "Fastighetsservice"],
    path: "/professional/Cleaning_Facility",
  },
  {
    title: "Specialföretag",
    resource: ["Glasmästare", "Målare", "Brandföretag"],
    path: "/professional/Specialized",
  },
  {
    title: "Mark & Schakt",
    resource: ["Schaktmaskinist", "Grävmaskinist", "Lastbilsförare"],
    path: "/professional/Earthworks_Excavation",
  },
];

export default function ProfessionalPricingContent() {
  // Inputs
  const [omsattning, setOmsattning] = useState(2000000);
  const [anstallda, setAnstallda] = useState(4);
  const [loner, setLoner] = useState(1300000);

  // Dropdown controls
  const [industryOpen, setIndustryOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);

  // Selections
  const [selectedIndustry, setSelectedIndustry] = useState(services[1]); // default Installation
  const [selectedResource, setSelectedResource] = useState(
    services[1].resource[1]
  ); // default Rörmokare

  // ROI results (calculated only when button clicked)
  const [roiResult, setRoiResult] = useState({
    intaktOkning: 0,
    profitMargin: 0,
    lonBesparing: 0,
    totalProfit: 0,
    profitPercent: 0,
  });

  // Calculate ROI
  const calculateROI = () => {
    const newRevenue = omsattning * 1.11; // +11%
    const profitMargin = newRevenue * 0.05; // 5%
    const lonBesparing = loner * 0.1; // 10%
    const totalProfit = profitMargin + lonBesparing;
    const profitPercent = (totalProfit / newRevenue) * 100;

    setRoiResult({
      intaktOkning: newRevenue,
      profitMargin,
      lonBesparing,
      totalProfit,
      profitPercent,
    });
  };

  const formatSE = (num: number) =>
    num.toLocaleString("sv-SE", { maximumFractionDigits: 0 });

  // Employee handlers
  const handleRemoveEmployee = () =>
    setAnstallda((prev) => Math.max(1, prev - 1));
  const handleAddEmployee = () => setAnstallda((prev) => prev + 1);

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-sm text-gray-500 mb-2">
          Timeflowsystem – kalkylator
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Programvara som betalar för sig själv – och mer därtill
        </h2>
        <p className="text-gray-600">
          Se hur mycket intäkter du kan generera samt tid du kan spara genom att
          lägga till Timeflowsystem i teamet
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* LEFT */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-6">
          {/* Dropdowns in one row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Industry dropdown */}
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="industry">
                Välj bransch
              </label>
              <button
                id="industry"
                onClick={() => setIndustryOpen(!industryOpen)}
                className="w-full bg-[#FF7A00] text-white font-medium py-2 px-4 rounded-xl flex justify-between items-center"
              >
                {selectedIndustry.title}
                <ChevronDown className="w-5 h-5 ml-2" />
              </button>
              {industryOpen && (
                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  {services.map((service) => (
                    <button
                      key={service.title}
                      onClick={() => {
                        setSelectedIndustry(service);
                        setSelectedResource(service.resource[0]); // reset resource
                        setIndustryOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Resource dropdown */}
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="resource">
                Välj kategori
              </label>
              <button
                id="resource"
                onClick={() => setResourceOpen(!resourceOpen)}
                className="w-full border font-medium py-2 px-4 rounded-xl flex justify-between items-center"
              >
                {selectedResource}
                <ChevronDown className="w-5 h-5 ml-2" />
              </button>
              {resourceOpen && (
                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  {selectedIndustry.resource.map((res) => (
                    <button
                      key={res}
                      onClick={() => {
                        setSelectedResource(res);
                        setResourceOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {res}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div>
            <label htmlFor="omsattning" className="font-medium mb-2 block">
              Årlig omsättning
            </label>
            <input
              id="omsattning"
              type="number"
              value={omsattning}
              onChange={(e) => setOmsattning(Number(e.target.value))}
              className="w-full border rounded-xl p-3"
              placeholder="Ange årlig omsättning"
            />
          </div>

          {/* Number of employees */}
          <div>
            <label
              htmlFor="antal-anstallda"
              className="font-medium mb-2 block"
            >
              Antal anställda
            </label>
            <div
              id="antal-anstallda"
              className="flex items-center border rounded-xl p-3 justify-between"
            >
              <span className="text-[#FF7A00] font-medium">Antal</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRemoveEmployee}
                  aria-label="Minska antal anställda"
                  className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                >
                  –
                </button>
                <span className="min-w-20 text-center">
                  {anstallda} stycken
                </span>
                <button
                  onClick={handleAddEmployee}
                  aria-label="Öka antal anställda"
                  className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Salaries */}
          <div>
            <label htmlFor="loner" className="font-medium mb-2 block">
              Löner per år
            </label>
            <input
              id="loner"
              type="number"
              value={loner}
              onChange={(e) => setLoner(Number(e.target.value))}
              className="w-full border rounded-xl p-3"
              placeholder="Ange årliga löner"
            />
          </div>

          {/* Calculate button */}
          <button
            onClick={calculateROI}
            className="w-full bg-[#FF7A00] text-white font-semibold py-3 rounded-xl hover:bg-[#e56f00] mt-4"
          >
            Beräkna ROI
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-[#FF914D] text-white rounded-2xl shadow-md p-6 flex flex-col gap-6">
          <h3 className="text-lg font-semibold">
            Din beräknad ROI med Timeflowsystem
          </h3>

          <div className="flex justify-between bg-[#E0712D] rounded-xl p-3">
            <span>Ny årlig omsättning (11 % ökning)</span>
            <span className="font-bold text-lg">
              {formatSE(roiResult.intaktOkning)} kr
            </span>
          </div>

          <div className="flex justify-between bg-[#E0712D] rounded-xl p-3">
            <span>Vinstmarginal (5 %)</span>
            <span className="font-bold text-lg">
              {formatSE(roiResult.profitMargin)} kr
            </span>
          </div>

          <div className="flex justify-between bg-[#E0712D] rounded-xl p-3">
            <span>Besparing av löner (10 %)</span>
            <span className="font-bold text-lg">
              {formatSE(roiResult.lonBesparing)} kr
            </span>
          </div>

          <div className="flex justify-between bg-[#E0712D] rounded-xl p-3">
            <span>Total vinst</span>
            <span className="font-bold text-lg">
              {formatSE(roiResult.totalProfit)} kr
            </span>
          </div>

          <div className="flex justify-between bg-[#E0712D] rounded-xl p-3">
            <span>Vinst i % av ny omsättning</span>
            <span className="font-bold text-lg">
              {roiResult.profitPercent.toFixed(1)} %
            </span>
          </div>

          <p className="text-sm">
            Vinsten för dig som {selectedResource} blir{" "}
            <span className="font-bold">
              {formatSE(roiResult.totalProfit)} kr
            </span>{" "}
            varje år med Timeflowsystem som projektverktyg
          </p>

          <a href={selectedIndustry.path} className="underline text-sm">
            Läs mer om {selectedIndustry.title} →
          </a>
        </div>
      </div>
      <div className="max-w-3xl mx-auto text-center text-xs text-gray-500 mt-6">
        <p>**Baserat på en analys från 2025 av över 500 företag. Den genomsnittliga tillväxten av projektintäkter bestämdes av aggregerade och anonymiserade projektdata som registrerats i Timeflowsystem. Resultaten kan variera och är inte en garanti för enskilda företags resultat, vår kalyl vinst är 5 % av den årliga omsättningen**</p>
      </div>
    </div>
  );
}
