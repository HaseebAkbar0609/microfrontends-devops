import {
  ProfessionalPersonalHero,
  ProfessionalPersonalContent,
} from "@/components/professional/Personal";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalPersonalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Personal</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalPersonalHero /> */}
        <ProfessionalPersonalContent />
      </div>
    </>
  );
};

export default ProfessionalPersonalPage;
