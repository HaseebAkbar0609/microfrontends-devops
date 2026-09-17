import {
  ProfessionalProjectToolsHero,
  ProfessionalProjectToolsContent,
} from "@/components/consumer/project-tools";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalProjectToolsPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.projectToolsTitle")}</title>
        <meta name="description" content={t("seo.projectToolsDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.projectToolsOgTitle")} />
        <meta property="og:description" content={t("seo.projectToolsOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalProjectToolsHero />
        <ProfessionalProjectToolsContent />
      </div>
    </>
  );
};

export default ProfessionalProjectToolsPage;
