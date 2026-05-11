import {
  ProfessionalConsultant_ArchitectHero,
  ProfessionalConsultant_ArchitectContent,
} from "@/components/professional/Consultant_Architect";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalConsultant_ArchitectPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Consultant_Architect</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionaConsultant_ArchitectHero /> */}
        <ProfessionalConsultant_ArchitectContent />
      </div>
    </>
  );
};

export default ProfessionalConsultant_ArchitectPage;
