import {
  ConsumerLandingAboutUs,
  ConsumerLandingContactUs,
  ConsumerLandingHero,
  ConsumerLandingNews,
  ConsumerLandingRegisterReason,
} from "@/components/consumer-landing";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerLandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Consumer</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerLandingHero />
        <ConsumerLandingNews />
        <ConsumerLandingAboutUs />
        <ConsumerLandingRegisterReason />
        <ConsumerLandingContactUs />
      </div>
    </>
  );
};

export default ConsumerLandingPage;
