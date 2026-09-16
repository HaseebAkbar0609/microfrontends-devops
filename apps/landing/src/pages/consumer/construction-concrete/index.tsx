import {
  ConstructionConcreteHero,
  ConstructionConcreteContent,
} from "@/components/consumer/construction-concrete";
import { NextPage } from "next";
import { useTranslation } from "react-i18next";
import Head from "next/head";

const ConstructionConcretePage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
         {/* <title>TimeFlowSystem - Bygg & Betong</title> */}
        <title>{t("seo.constructionConcreteTitle")}</title>
        <meta name="description" content={t("seo.constructionConcreteDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.constructionConcreteOgTitle")} />
        <meta property="og:description" content={t("seo.constructionConcreteOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <ConstructionConcreteHero />
        <ConstructionConcreteContent />
      </div>
    </>
  );
};

export default ConstructionConcretePage;
