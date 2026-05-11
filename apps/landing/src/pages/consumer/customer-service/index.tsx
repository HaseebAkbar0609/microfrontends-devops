import { NextPage } from "next";
import Head from "next/head";
import {
  CustomerServiceHero,
  CustomerServiceContent,
} from "@/components/consumer/customer-service";

const CustomerServicePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Kundservice</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <CustomerServiceHero />
        <CustomerServiceContent />
      </div>
    </>
  );
};

export default CustomerServicePage;
