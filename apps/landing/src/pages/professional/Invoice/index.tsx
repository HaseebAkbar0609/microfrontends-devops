import {
  ProfessionalInvoiceHero,
  ProfessionalInvoiceContent,
} from "@/components/professional/Invoice";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalInvoicePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Offert</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalInvoiceHero /> */}
        <ProfessionalInvoiceContent />
      </div>
    </>
  );
};

export default ProfessionalInvoicePage;
