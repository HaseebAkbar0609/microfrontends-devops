import {
  ProfessionalConstruction_ConcreteHero,
  ProfessionalConstruction_ConcreteContent,
} from "@/components/professional/Construction_Concrete";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalConstruction_ConcretePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Construction_Concrete</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalConstruction_ConcreteHero /> */}
        <ProfessionalConstruction_ConcreteContent />
      </div>
    </>
  );
};

export default ProfessionalConstruction_ConcretePage;
