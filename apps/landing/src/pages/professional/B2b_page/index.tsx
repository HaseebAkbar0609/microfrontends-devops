import {
  ProfessionalB2b_pageHero,
  ProfessionalB2b_pageContent,
} from "@/components/professional/B2b_page";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalB2b_pagePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Offert</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalB2b_pageHero /> */}
        <ProfessionalB2b_pageContent />
      </div>
    </>
  );
};

export default ProfessionalB2b_pagePage;
