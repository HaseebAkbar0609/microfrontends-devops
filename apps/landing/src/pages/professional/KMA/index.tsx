import {
  ProfessionalKMAHero,
  ProfessionalKMAContent,
} from "@/components/professional/KMA";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalKMAPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - KMA</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalKMAHero /> */}
        <ProfessionalKMAContent />
      </div>
    </>
  );
};

export default ProfessionalKMAPage;
