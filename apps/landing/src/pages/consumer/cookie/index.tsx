import {
  ConsumerCookieContent,
  ConsumerCookieHero,
} from "@/components/consumer/cookie";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerCookiePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Consumer - Cookie</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerCookieHero />
        <ConsumerCookieContent />
      </div>
    </>
  );
};

export default ConsumerCookiePage;
