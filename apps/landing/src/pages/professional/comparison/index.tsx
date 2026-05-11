import {
  ProfessionalComparisonHero,
  ProfessionalComparisonContent,
} from "@/components/professional/comparison";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalComparisonPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Jämförelse</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalComparisonHero />
        <ProfessionalComparisonContent />
      </div>
    </>
  );
};

export default ProfessionalComparisonPage;
