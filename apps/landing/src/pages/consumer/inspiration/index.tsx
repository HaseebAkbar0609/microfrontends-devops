import { NextPage } from "next";
import Head from "next/head";
import {
  InspirationHero,
  InspirationContent,
} from "@/components/consumer/inspiration";

const InspirationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Insperation</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <InspirationHero />
        <InspirationContent />
      </div>
    </>
  );
};

export default InspirationPage;
