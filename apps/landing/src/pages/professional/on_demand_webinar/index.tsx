import {
  ProfessionalOnDemandWebinarHero,
  ProfessionalOnDemandWebinarContent,
} from "@/components/professional/on_demand_webinar";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalOnDemandWebinarPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - On Demand Webinar</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalOnDemandWebinarHero />
        <ProfessionalOnDemandWebinarContent />
      </div>
    </>
  );
};

export default ProfessionalOnDemandWebinarPage;
