import {
  ProfessionalLand_ExcavationHero,
  ProfessionalLand_ExcavationContent,
} from "@/components/professional/Land_Excavation";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalLand_ExcavationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Land_Excavation</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalLand_ExcavationHero /> */}
        <ProfessionalLand_ExcavationContent />
      </div>
    </>
  );
};

export default ProfessionalLand_ExcavationPage;
