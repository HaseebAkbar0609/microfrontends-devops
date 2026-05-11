import {
  ProfessionalMachineHero,
  ProfessionalMachineContent,
} from "@/components/professional/Machine";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalMachinePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Machine</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalMachineHero /> */}
        <ProfessionalMachineContent />
      </div>
    </>
  );
};

export default ProfessionalMachinePage;
