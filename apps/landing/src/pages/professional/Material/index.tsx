import {
  ProfessionalMaterialHero,
  ProfessionalMaterialContent,
} from "@/components/professional/Material";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalMaterialPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Material</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalMaterialHero /> */}
        <ProfessionalMaterialContent />
      </div>
    </>
  );
};

export default ProfessionalMaterialPage;