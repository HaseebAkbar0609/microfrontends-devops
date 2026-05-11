import {
  ProfessionalLandingAboutUs,
  ProfessionalLandingContactUs,
  ProfessionalLandingHero,
  ProfessionalLandingNews,
  ProfessionalLandingRegisterReason,
} from "@/components/professional-landing";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalLandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalLandingHero />
        <ProfessionalLandingNews />
        <ProfessionalLandingAboutUs />
        <ProfessionalLandingRegisterReason />
        <ProfessionalLandingContactUs />
      </div>
    </>
  );
};

export default ProfessionalLandingPage;
