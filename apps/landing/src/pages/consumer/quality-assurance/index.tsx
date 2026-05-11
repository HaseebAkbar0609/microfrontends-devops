import {
  QualityAssuranceHero,
  QualityAssuranceContent,
} from "@/components/consumer/quality-assurance";
import { NextPage } from "next";
import Head from "next/head";

const QualityAssurancePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Kvalitetssäkring</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <QualityAssuranceHero />
        <QualityAssuranceContent />
      </div>
    </>
  );
};

export default QualityAssurancePage;
