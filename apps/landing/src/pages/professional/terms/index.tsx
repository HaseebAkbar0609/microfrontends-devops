import {
  ProfessionalTermsHero,
  ProfessionalTermsContent,
} from "@/components/professional/terms";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalTermsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Terms</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalTermsHero />
        <ProfessionalTermsContent />
      </div>
    </>
  );
};

export default ProfessionalTermsPage;
