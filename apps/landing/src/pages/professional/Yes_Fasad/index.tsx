import {
  ProfessionalYes_FasadContent,
} from "@/components/professional/Yes_Fasad";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalYes_FasadPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalYes_FasadTitle")}</title>
        <meta name="description" content={t("seo.professionalYes_FasadDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalYes_FasadOgTitle")} />
        <meta property="og:description" content={t("seo.professionalYes_FasadOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalYes_FasadHero /> */}
        <ProfessionalYes_FasadContent />
      </div>
    </>
  );
};

export default ProfessionalYes_FasadPage;
