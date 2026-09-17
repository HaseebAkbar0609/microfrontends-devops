import {
  ProfessionalInstallationsContent,
} from "@/components/professional/Installations";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalInstallationsPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalInstallationsTitle")}</title>
        <meta name="description" content={t("seo.professionalInstallationsDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalInstallationsOgTitle")} />
        <meta property="og:description" content={t("seo.professionalInstallationsOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalInstallationsHero /> */}
        <ProfessionalInstallationsContent />
      </div>
    </>
  );
};

export default ProfessionalInstallationsPage;
