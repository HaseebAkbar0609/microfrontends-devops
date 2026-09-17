import {
  LandExcavationHero,
 LandExcavationContent,
} from "@/components/consumer/land-excavation";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const LandExcavationPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.landExcavationTitle")}</title>
        <meta name="description" content={t("seo.landExcavationDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.landExcavationOgTitle")} />
        <meta property="og:description" content={t("seo.landExcavationOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <LandExcavationHero />
        <LandExcavationContent />
      </div>
    </>
  );
};

export default LandExcavationPage;
