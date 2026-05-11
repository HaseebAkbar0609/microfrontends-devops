import {
  ProfessionalDataHero,
  ProfessionalDataContent,
} from "@/components/professional/Data";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalDataPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Data</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalDataHero /> */}
        <ProfessionalDataContent />
      </div>
    </>
  );
};

export default ProfessionalDataPage;
