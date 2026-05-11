import {
  ProfessionalCoatingHero,
  ProfessionalCoatingContent,
} from "@/components/professional/Coating";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalCoatingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Coating</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalCoatingHero /> */}
        <ProfessionalCoatingContent />
      </div>
    </>
  );
};

export default ProfessionalCoatingPage;
