import {
  ProfessionalPurchaseHero,
  ProfessionalPurchaseContent,
} from "@/components/professional/Purchase";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalPurchasePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Purchase</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalPurchaseHero /> */}
        <ProfessionalPurchaseContent />
      </div>
    </>
  );
};

export default ProfessionalPurchasePage;
