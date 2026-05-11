import {
  ConsultantArchitectHero,
  ConsultantArchitectContent,
} from "@/components/consumer/consultant-architect";
import { NextPage } from "next";
import Head from "next/head";

const ConsultantArchitectPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - ConsultantArchitect</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ConsultantArchitectHero />
        <ConsultantArchitectContent />
      </div>
    </>
  );
};

export default ConsultantArchitectPage;
