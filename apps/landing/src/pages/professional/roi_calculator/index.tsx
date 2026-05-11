import {
//   ProfessionalPricingHero,
  ProfessionalPricingContent,
} from "@/components/professional/roi_calculator";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalPricingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Prissättning</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalPricingHero /> */}
        <ProfessionalPricingContent />
      </div>
    </>
  );
};

export default ProfessionalPricingPage;
