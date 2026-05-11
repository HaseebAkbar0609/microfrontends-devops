import {
  ProfessionalAppWorkHero,
  ProfessionalAppWorkContent,
} from "@/components/professional/AppWork";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalAppWorkPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - App TimeFlow Work</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalAppWorkHero /> */}
        <ProfessionalAppWorkContent />
      </div>
    </>
  );
};

export default ProfessionalAppWorkPage;
