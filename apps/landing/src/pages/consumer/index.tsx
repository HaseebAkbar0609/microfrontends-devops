import {
  ConsumerHero,
  ConsumerHowItWorks,
  Craftsman,
  QualityAndSafety,
  Register,
  Service,
  Timeflow,
  WhatOurUserSay,
} from "@/components/consumer";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Consumer</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerHero />
        <ConsumerHowItWorks />
        <WhatOurUserSay />
        <Service />
        <QualityAndSafety />
        <Timeflow />
        <Craftsman />
        <Register />
      </div>
    </>
  );
};

export default ConsumerPage;
