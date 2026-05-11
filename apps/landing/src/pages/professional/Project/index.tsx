import {
  ProfessionalProjectHero,
  ProfessionalProjectContent,
} from "@/components/professional/Project";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalProjectPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Project</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalProjectHero /> */}
        <ProfessionalProjectContent />
      </div>
    </>
  );
};

export default ProfessionalProjectPage;
