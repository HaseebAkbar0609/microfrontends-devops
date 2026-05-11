import {
  ProfessionalYes_FasadHero,
  ProfessionalYes_FasadContent,
} from "@/components/professional/Yes_Fasad";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalYes_FasadPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Yes_Fasad</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalYes_FasadHero /> */}
        <ProfessionalYes_FasadContent />
      </div>
    </>
  );
};

export default ProfessionalYes_FasadPage;
