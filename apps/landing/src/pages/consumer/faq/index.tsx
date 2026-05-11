import { ConsumerFaqContent, ConsumerFaqHero } from "@/components/consumer/faq";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerFaqPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Consumer - FAQ</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerFaqHero />
        <ConsumerFaqContent />
      </div>
    </>
  );
};

export default ConsumerFaqPage;
