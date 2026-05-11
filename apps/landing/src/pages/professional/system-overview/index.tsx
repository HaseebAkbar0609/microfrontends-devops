import {
  SystemOverviewHero,
  SystemOverviewContent,
} from "@/components/professional/system-overview";
import { NextPage } from "next";
import Head from "next/head";

const SystemOverviewPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Se systemet</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <SystemOverviewHero />
        <SystemOverviewContent />
      </div>
    </>
  );
};

export default SystemOverviewPage;