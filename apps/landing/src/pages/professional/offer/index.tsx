import {
  ProfessionalOfferHero,
  ProfessionalOfferContent,
} from "@/components/professional/offer";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalOfferPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Offert</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalOfferHero /> */}
        <ProfessionalOfferContent />
      </div>
    </>
  );
};

export default ProfessionalOfferPage;
