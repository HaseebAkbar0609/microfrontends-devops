import {
  SpecialCompanyHero,
  SpecialCompanyContent,
} from "@/components/consumer/special-company";
import { NextPage } from "next";
import Head from "next/head";

const SpecialCompanyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Special Company</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <SpecialCompanyHero />
        <SpecialCompanyContent />
      </div>
    </>
  );
};

export default SpecialCompanyPage;
