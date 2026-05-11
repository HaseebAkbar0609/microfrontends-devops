import Select from "@/components/home/select";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

interface CountryOption {
  label: string;
  value: string;
  icon: string;
}

export default function Home() {
  const [hoverButton, setHoverButton] = useState("");

  const [selectedRegion, setSelectedRegion] = useState<string | number>(
    "Northern Europe"
  );
  const [selectedCountry, setSelectedCountry] = useState<string | number>(
    "Sweden"
  );

  const regionOptions = [
    { value: "Northern Europe", label: "Northern Europe" },
    { value: "Western Europe", label: "Western Europe" },
    { value: "Southern Europe", label: "Southern Europe" },
    { value: "Eastern Europe", label: "Eastern Europe" },
    { value: "Americas", label: "Americas" },
    { value: "Asia", label: "Asia" },
    { value: "Oceania", label: "Oceania" },
  ];

  const countryOptions: Record<string | number, CountryOption[]> = {
    "Northern Europe": [
      {
        label: "Sweden",
        value: "Sweden",
        icon: "https://flagcdn.com/se.svg",
      },
      {
        label: "Norway",
        value: "Norway",
        icon: "https://flagcdn.com/no.svg",
      },
      {
        label: "Denmark",
        value: "Denmark",
        icon: "https://flagcdn.com/dk.svg",
      },
      {
        label: "Finland",
        value: "Finland",
        icon: "https://flagcdn.com/fi.svg",
      },
      {
        label: "Estonia",
        value: "Estonia",
        icon: "https://flagcdn.com/ee.svg",
      },
    ],
    "Western Europe": [
      {
        label: "Germany",
        value: "Germany",
        icon: "https://flagcdn.com/de.svg",
      },
      {
        label: "England",
        value: "England",
        icon: "https://flagcdn.com/gb.svg",
      },
      {
        label: "France",
        value: "France",
        icon: "https://flagcdn.com/fr.svg",
      },
      {
        label: "Switzerland",
        value: "Switzerland",
        icon: "https://flagcdn.com/ch.svg",
      },
      {
        label: "Austria",
        value: "Austria",
        icon: "https://flagcdn.com/at.svg",
      },
      {
        label: "Ireland",
        value: "Ireland",
        icon: "https://flagcdn.com/ie.svg",
      },
      {
        label: "Belgium",
        value: "Belgium",
        icon: "https://flagcdn.com/be.svg",
      },
      {
        label: "Netherlands",
        value: "Netherlands",
        icon: "https://flagcdn.com/nl.svg",
      },
    ],
    "Southern Europe": [
      {
        label: "Italy",
        value: "Italy",
        icon: "https://flagcdn.com/it.svg",
      },
      {
        label: "Greece",
        value: "Greece",
        icon: "https://flagcdn.com/gr.svg",
      },
      {
        label: "Spain",
        value: "Spain",
        icon: "https://flagcdn.com/es.svg",
      },
      {
        label: "Portugal",
        value: "Portugal",
        icon: "https://flagcdn.com/pt.svg",
      },
    ],
    "Eastern Europe": [
      {
        label: "Poland",
        value: "Poland",
        icon: "https://flagcdn.com/pl.svg",
      },
      {
        label: "Czech Republic",
        value: "Czech Republic",
        icon: "https://flagcdn.com/cz.svg",
      },
      {
        label: "Latvia",
        value: "Latvia",
        icon: "https://flagcdn.com/lv.svg",
      },
      {
        label: "Lithuania",
        value: "Lithuania",
        icon: "https://flagcdn.com/lt.svg",
      },
    ],
    Americas: [
      {
        label: "USA",
        value: "USA",
        icon: "https://flagcdn.com/us.svg",
      },
      {
        label: "Canada",
        value: "Canada",
        icon: "https://flagcdn.com/ca.svg",
      },
    ],
    Asia: [
      {
        label: "India",
        value: "India",
        icon: "https://flagcdn.com/in.svg",
      },
      {
        label: "Singapore",
        value: "Singapore",
        icon: "https://flagcdn.com/sg.svg",
      },
      {
        label: "South Korea",
        value: "South Korea",
        icon: "https://flagcdn.com/kr.svg",
      },
    ],
    Oceania: [
      {
        label: "New Zealand",
        value: "New Zealand",
        icon: "https://flagcdn.com/nz.svg",
      },
      {
        label: "Australia",
        value: "Australia",
        icon: "https://flagcdn.com/au.svg",
      },
    ],
  };

  const handleRegionChange = (region: string | number) => {
    setSelectedRegion(region);
    setSelectedCountry(countryOptions[region][0].value);
  };

  const handleCountryChange = (country: string | number) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <Head>
        <title>TimeFlowSystem</title>
        <meta name="description" content="landing page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="w-screen h-screen relative flex">
        <div
          className={`${
            hoverButton === "professional"
              ? "flex-[2]"
              : hoverButton === "consumer"
              ? "flex-0"
              : "flex-1"
          } overflow-hidden transition-all duration-700 ease-in-out`}
        >
          <img
            className="w-full h-full object-cover pointer-events-none"
            src="/images/landing_left.png"
            alt="landing_left.png"
          />
        </div>
        <div
          className={`${
            hoverButton === "consumer"
              ? "flex-[2]"
              : hoverButton === "professional"
              ? "flex-0"
              : "flex-1"
          } overflow-hidden transition-all duration-700 ease-in-out`}
        >
          <img
            className="w-full h-full object-cover pointer-events-none"
            src="/images/landing_right.png"
            alt="landing_right.png"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF6600] p-4 lg:p-6 rounded-lg w-4/5 sm:w-3/5 lg:w-[48%]">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <div className="bg-white rounded-2xl py-2 px-3 lg:py-4 lg:px-5">
                <Link href={"/"}>
                  <img
                    className="w-50 h-auto"
                    src="/images/logo.png"
                    alt="logo.png"
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-col min-w-45">
              <Select
                options={regionOptions}
                onChange={handleRegionChange}
                value={selectedRegion}
              />

              <Select
                className="mt-3"
                options={countryOptions[selectedRegion]}
                onChange={handleCountryChange}
                value={selectedCountry}
              />
            </div>
          </div>

          <div className="mt-4 text-white">
            <h1 className="font-[600] text-3xl">Hej hur kan vi</h1>
            <h1 className="font-[600] text-3xl">hjälpa dig?</h1>
            <div className="w-full h-[1px] bg-white my-8"></div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 lg:gap-12">
            <Link href="/professional">
              <button
                className="inline-block bg-[#545454] text-white cursor-pointer py-2 px-3 sm:py-4 sm:px-6 rounded-lg font-bold text-base transition-all duration-200 ease-in-out opacity-90 hover:opacity-100"
                onMouseEnter={() => setHoverButton("professional")}
                onMouseLeave={() => setHoverButton("")}
              >
                Professionell
              </button>
            </Link>

            <p>eller</p>

            <Link href="/consumer">
              <button
                className="inline-block bg-[#e9e9e9] text-[#f58220] cursor-pointer py-2 px-3 sm:py-4 sm:px-6 rounded-lg font-bold text-base transition-all duration-200 ease-in-out opacity-90 hover:opacity-100"
                onMouseEnter={() => setHoverButton("consumer")}
                onMouseLeave={() => setHoverButton("")}
              >
                Konsument
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      hasHeader: false,
    },
  };
};
