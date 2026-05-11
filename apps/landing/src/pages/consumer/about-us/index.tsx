import {
  ConsumerAboutUsContent,
  ConsumerAboutUsHero,
} from "@/components/consumer/about-us";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerAboutUsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Consumer - About Us</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerAboutUsHero />
        <ConsumerAboutUsContent />
      </div>
    </>
  );
};

export default ConsumerAboutUsPage;
