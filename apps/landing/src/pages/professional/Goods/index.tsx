import {
  ProfessionalGoodsHero,
  ProfessionalGoodsContent,
} from "@/components/professional/Goods";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalGoodsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Goods</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalGoodsHero /> */}
        <ProfessionalGoodsContent />
      </div>
    </>
  );
};

export default ProfessionalGoodsPage;
