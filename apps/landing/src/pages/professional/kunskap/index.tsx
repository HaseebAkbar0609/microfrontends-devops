import {
  ProfessionalKunskapHero,
  ProfessionalKunskapContent,
} from "@/components/professional/kunskap";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalKunskapPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Kunskap</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalKunskapHero />
        <ProfessionalKunskapContent />
      </div>
    </>
  );
};

export default ProfessionalKunskapPage;
