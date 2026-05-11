import {
  ProfessionalProject_DesignHero,
  ProfessionalProject_DesignContent,
} from "@/components/professional/Project_Design";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalProject_DesignPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Project_Design</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalProject_DesignHero /> */}
        <ProfessionalProject_DesignContent />
      </div>
    </>
  );
};

export default ProfessionalProject_DesignPage;
