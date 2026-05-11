import {
  ProfessionalManagementHero,
  ProfessionalManagementContent,
} from "@/components/professional/Management";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalManagementPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Management</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalManagementHero /> */}
        <ProfessionalManagementContent />
      </div>
    </>
  );
};

export default ProfessionalManagementPage;
