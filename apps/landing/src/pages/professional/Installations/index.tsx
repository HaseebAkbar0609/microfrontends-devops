import {
  ProfessionalInstallationsHero,
  ProfessionalInstallationsContent,
} from "@/components/professional/Installations";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalInstallationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Installations</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalInstallationsHero /> */}
        <ProfessionalInstallationsContent />
      </div>
    </>
  );
};

export default ProfessionalInstallationsPage;
