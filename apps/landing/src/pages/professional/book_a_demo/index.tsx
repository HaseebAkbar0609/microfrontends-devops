import {
  ProfessionalDemoHero,
  ProfessionalDemoContent,
} from "@/components/professional/book_a_demo";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalDemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Boka demo</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalDemoHero />
        <ProfessionalDemoContent />
      </div>
    </>
  );
};

export default ProfessionalDemoPage;
