import {
  ProfessionalIntegritetspolicyHero,
  ProfessionalIntegritetspolicyContent,
} from "@/components/consumer/privacy";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalIntegritetspolicyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Integritetspolicy</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalIntegritetspolicyHero />
        <ProfessionalIntegritetspolicyContent />
      </div>
    </>
  );
};

export default ProfessionalIntegritetspolicyPage;
