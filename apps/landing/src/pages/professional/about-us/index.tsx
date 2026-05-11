import {
  ProfessionalAboutUsContent,
  ProfessionalAboutUsHero,
} from "@/components/professional/about-us";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalAboutUsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - About Us</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalAboutUsHero />
        <ProfessionalAboutUsContent />
      </div>
    </>
  );
};

export default ProfessionalAboutUsPage;
