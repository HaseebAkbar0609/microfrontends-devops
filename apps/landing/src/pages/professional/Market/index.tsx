import {
  ProfessionalMarketHero,
  ProfessionalMarketContent,
} from "@/components/professional/Market";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalMarketPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Market</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalMarketHero /> */}
        <ProfessionalMarketContent />
      </div>
    </>
  );
};

export default ProfessionalMarketPage;
