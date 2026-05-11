import {
  ProfessionalAgreementHero,
  ProfessionalAgreementContent,
} from "@/components/professional/Agreement";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalAgreementPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Agreement</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalAgreementHero /> */}
        <ProfessionalAgreementContent />
      </div>
    </>
  );
};

export default ProfessionalAgreementPage;
