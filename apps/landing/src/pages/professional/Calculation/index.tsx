import {
  ProfessionalCalculationHero,
  ProfessionalCalculationContent,
} from "@/components/professional/Calculation";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalCalculationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Calculation</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalCalculationHero /> */}
        <ProfessionalCalculationContent />
      </div>
    </>
  );
};

export default ProfessionalCalculationPage;
