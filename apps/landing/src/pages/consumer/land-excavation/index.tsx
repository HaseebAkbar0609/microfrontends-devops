import {
  LandExcavationHero,
 LandExcavationContent,
} from "@/components/consumer/land-excavation";
import { NextPage } from "next";
import Head from "next/head";

const LandExcavationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Bygg & Betong</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <LandExcavationHero />
        <LandExcavationContent />
      </div>
    </>
  );
};

export default LandExcavationPage;
