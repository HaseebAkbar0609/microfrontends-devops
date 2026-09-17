import {
  ProfessionalLandingAboutUs,
  ProfessionalLandingContactUs,
  ProfessionalLandingHero,
  ProfessionalLandingNews,
  ProfessionalLandingRegisterReason,
} from "@/components/professional-landing";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalLandingPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalLandingTitle")}</title>
        <meta name="description" content={t("seo.professionalLandingDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalLandingOgTitle")} />
        <meta property="og:description" content={t("seo.professionalLandingOgDesc")} />
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalLandingHero />
        <ProfessionalLandingNews />
        <ProfessionalLandingAboutUs />
        <ProfessionalLandingRegisterReason />
        <ProfessionalLandingContactUs />
      </div>
    </>
  );
};

export default ProfessionalLandingPage;
