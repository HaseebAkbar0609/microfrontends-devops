import {
  ProfessionalFaqContent,
  ProfessionalFaqHero,
} from "@/components/professional/faq";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalFaqPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - FAQ</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalFaqHero />
        <ProfessionalFaqContent />
      </div>
    </>
  );
};

export default ProfessionalFaqPage;
