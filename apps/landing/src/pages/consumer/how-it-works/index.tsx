import {
  ProfessionalHowItWorksHero,
  ProfessionalHowItWorksContent,
} from "@/components/consumer/how-it-works";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalHowItWorksPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Så fungerar det</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalHowItWorksHero />
        <ProfessionalHowItWorksContent />
      </div>
    </>
  );
};

export default ProfessionalHowItWorksPage;
