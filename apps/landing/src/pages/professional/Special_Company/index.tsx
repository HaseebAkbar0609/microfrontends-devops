import {
  ProfessionalSpecial_CompanyContent,
} from "@/components/professional/Special_Company";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalSpecial_CompanyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Special_Company</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalSpecial_CompanyHero /> */}
        <ProfessionalSpecial_CompanyContent />
      </div>
    </>
  );
};

export default ProfessionalSpecial_CompanyPage;
