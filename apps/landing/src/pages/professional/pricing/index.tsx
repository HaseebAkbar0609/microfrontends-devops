import {
  ProfessionalPricing2Hero,
  ProfessionalPricing2Content,
} from "@/components/professional/pricing";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalPricing2Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Prissättning</title>
      </Head>
      <div className="w-full bg-white">
        <ProfessionalPricing2Hero />
        <ProfessionalPricing2Content />
      </div>
    </>
  );
};

export default ProfessionalPricing2Page;
