import {
  ProfessionalComparisonHero,
  ProfessionalComparisonContent,
} from "@/components/professional/comparison";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalComparisonPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalComparisonTitle")}</title>
        <meta name="description" content={t("seo.professionalComparisonDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalComparisonOgTitle")} />
        <meta property="og:description" content={t("seo.professionalComparisonOgDesc")} />
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalComparisonHero />
        <ProfessionalComparisonContent />
      </div>
    </>
  );
};

export default ProfessionalComparisonPage;
