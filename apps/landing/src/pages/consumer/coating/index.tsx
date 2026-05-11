import {
  CoatingHero,
  CoatingContent,
} from "@/components/consumer/coating";
import { NextPage } from "next";
import Head from "next/head";

const CoatingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Bygg & Betong</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <CoatingHero />
        <CoatingContent />
      </div>
    </>
  );
};

export default CoatingPage;
