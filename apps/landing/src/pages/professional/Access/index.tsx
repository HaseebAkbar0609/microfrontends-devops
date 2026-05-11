import {
  ProfessionalAccessHero,
  ProfessionalAccessContent,
} from "@/components/professional/Access";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalAccessPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Åtkomsthantering</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalAccessHero /> */}
        <ProfessionalAccessContent />
      </div>
    </>
  );
};

export default ProfessionalAccessPage;