import {
  ProfessionalKunskapHero,
  ProfessionalKunskapContent,
} from "@/components/professional/kunskap";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalKunskapPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalKunskapTitle")}</title>
        <meta name="description" content={t("seo.professionalKunskapDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalKunskapOgTitle")} />
        <meta property="og:description" content={t("seo.professionalKunskapOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ProfessionalKunskapHero />
        <ProfessionalKunskapContent />
      </div>
    </>
  );
};

export default ProfessionalKunskapPage;
