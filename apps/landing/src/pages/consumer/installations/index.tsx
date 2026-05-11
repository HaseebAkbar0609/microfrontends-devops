import {
  InstallationsHero,
  InstallationsContent,
} from "@/components/consumer/installations";
import { NextPage } from "next";
import Head from "next/head";

const InstallationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Bygg & Betong</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <InstallationsHero />
        <InstallationsContent />
      </div>
    </>
  );
};

export default InstallationsPage;
