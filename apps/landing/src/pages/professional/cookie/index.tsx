import {
  ProfessionalCookieContent,
  ProfessionalCookieHero,
} from "@/components/professional/cookie";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalCookiePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Cookie</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalCookieHero />
        <ProfessionalCookieContent />
      </div>
    </>
  );
};

export default ProfessionalCookiePage;
