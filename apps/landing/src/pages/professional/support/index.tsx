import {
  ProfessionalSupportHero,
  ProfessionalSupportContent,
} from "@/components/professional/support";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalSupportPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Support</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalSupportHero />
        <ProfessionalSupportContent />
      </div>
    </>
  );
};

export default ProfessionalSupportPage;
