import {
  ProfessionalLegalHero,
  ProfessionalLegalContent,
} from "@/components/professional/Legal";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalLegalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Legal</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalLegalHero /> */}
        <ProfessionalLegalContent />
      </div>
    </>
  );
};

export default ProfessionalLegalPage;
