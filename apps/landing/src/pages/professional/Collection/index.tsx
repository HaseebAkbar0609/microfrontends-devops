import {
  ProfessionalCollectionHero,
  ProfessionalCollectionContent,
} from "@/components/professional/Collection";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalCollectionPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Collection</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalCollectionHero /> */}
        <ProfessionalCollectionContent />
      </div>
    </>
  );
};

export default ProfessionalCollectionPage;
