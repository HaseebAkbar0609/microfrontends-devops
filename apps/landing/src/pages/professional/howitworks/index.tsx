import {
  ProfessionalHowItWorksContent,
  ProfessionalHowItWorksHero,
} from "@/components/professional/howitworks";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalHowItWorksPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - How It Works</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalHowItWorksHero />
        <ProfessionalHowItWorksContent />
      </div>
    </>
  );
};

export default ProfessionalHowItWorksPage;
