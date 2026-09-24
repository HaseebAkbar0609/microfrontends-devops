import {
  ProfessionalAboutUsContent,
  ProfessionalAboutUsHero,
} from "@/components/professional/about-us";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalAboutUsPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalAboutUsTitle")}</title>
        <meta name="description" content={t("seo.professionalAboutUsDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalAboutUsOgTitle")} />
        <meta property="og:description" content={t("seo.professionalAboutUsOgDesc")} />
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalAboutUsHero />
        <ProfessionalAboutUsContent />
      </div>
    </>
  );
};

export default ProfessionalAboutUsPage;
