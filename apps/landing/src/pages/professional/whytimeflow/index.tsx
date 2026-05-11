import {
  ProfessionalWhyTimeFlowContent,
  ProfessionalWhyTimeFlowHero,
} from "@/components/professional/whytimeflow";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalWhyTimeFlowPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Why TimeFlow</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalWhyTimeFlowHero />
        <ProfessionalWhyTimeFlowContent />
      </div>
    </>
  );
};

export default ProfessionalWhyTimeFlowPage;
