import {
  ProfessionalOrderHero,
  ProfessionalOrderContent,
} from "@/components/professional/Order";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalOrderPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Order</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalOrderHero /> */}
        <ProfessionalOrderContent />
      </div>
    </>
  );
};

export default ProfessionalOrderPage;
