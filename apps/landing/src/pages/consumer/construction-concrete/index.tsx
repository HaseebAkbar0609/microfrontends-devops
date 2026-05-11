import {
  ConstructionConcreteHero,
  ConstructionConcreteContent,
} from "@/components/consumer/construction-concrete";
import { NextPage } from "next";
import Head from "next/head";

const ConstructionConcretePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Bygg & Betong</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ConstructionConcreteHero />
        <ConstructionConcreteContent />
      </div>
    </>
  );
};

export default ConstructionConcretePage;
