import {
  ConsumerTermsHero,
  ConsumerTermsContent,
} from "@/components/consumer/terms";
import { NextPage } from "next";
import Head from "next/head";

const ConsumerTermsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Användarvillkor</title>
      </Head>
      <div className="w-full bg-white text-left">
        <ConsumerTermsHero />
        <ConsumerTermsContent />
      </div>
    </>
  );
};

export default ConsumerTermsPage;
