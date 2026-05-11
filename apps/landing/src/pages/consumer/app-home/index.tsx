import {
  ProfessionalHomeHero,
  ProfessionalHomeContent,
} from "@/components/consumer/app-home";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalHomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Home</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalHomeHero /> */}
        <ProfessionalHomeContent />
      </div>
    </>
  );
};

export default ProfessionalHomePage;
