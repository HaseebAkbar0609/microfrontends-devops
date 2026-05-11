import {
  ProfessionalProjectToolsHero,
  ProfessionalProjectToolsContent,
} from "@/components/consumer/project-tools";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalProjectToolsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Projektverktyg</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalProjectToolsHero />
        <ProfessionalProjectToolsContent />
      </div>
    </>
  );
};

export default ProfessionalProjectToolsPage;
