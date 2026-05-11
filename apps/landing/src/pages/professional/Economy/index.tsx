import {
  ProfessionalEconomyHero,
  ProfessionalEconomyContent,
} from "@/components/professional/Economy";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalEconomyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Economy</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalEconomyHero /> */}
        <ProfessionalEconomyContent />
      </div>
    </>
  );
};

export default ProfessionalEconomyPage;
