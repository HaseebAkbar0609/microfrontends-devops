import {
  ProfessionalHowItWorksHero,
  ProfessionalHowItWorksContent,
} from "@/components/consumer/how-it-works";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalHowItWorksPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.howItWorkTitle")}</title>
        <meta name="description" content={t("seo.howItWorkDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.howItWorkOgTitle")} />
        <meta property="og:description" content={t("seo.howItWorkOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalHowItWorksHero />
        <ProfessionalHowItWorksContent />
      </div>
    </>
  );
};

export default ProfessionalHowItWorksPage;
