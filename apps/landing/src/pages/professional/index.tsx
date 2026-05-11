import {
  ProfessionalAdvantage,
  ProfessionalContactUs,
  ProfessionalHero,
  ProfessionalIntroduction,
  ProfessionalRating,
  ProfessionalSmartFeatures,
  SaveTime,
  SuccessStory,
  TimeFlowWork,
} from "@/components/professional";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalHero />
        <ProfessionalIntroduction />
        <ProfessionalSmartFeatures />
        <TimeFlowWork />
        <ProfessionalAdvantage />
        <ProfessionalRating />
        <SuccessStory />
        <SaveTime />
        <ProfessionalContactUs />
      </div>
    </>
  );
};

export default ProfessionalPage;
