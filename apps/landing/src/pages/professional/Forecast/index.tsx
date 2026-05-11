import {
  ProfessionalForecastHero,
  ProfessionalForecastContent,
} from "@/components/professional/Forecast";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalForecastPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Forecast</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalForecastHero /> */}
        <ProfessionalForecastContent />
      </div>
    </>
  );
};

export default ProfessionalForecastPage;
