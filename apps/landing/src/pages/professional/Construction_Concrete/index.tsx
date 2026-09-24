import {
  ProfessionalConstruction_ConcreteContent,
} from "@/components/professional/Construction_Concrete";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalConstruction_ConcretePage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalConstruction_ConcreteTitle")}</title>
        <meta name="description" content={t("seo.professionalConstruction_ConcreteDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalConstruction_ConcreteOgTitle")} />
        <meta property="og:description" content={t("seo.professionalConstruction_ConcreteOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalConstruction_ConcreteHero /> */}
        <ProfessionalConstruction_ConcreteContent />
      </div>
    </>
  );
};

export default ProfessionalConstruction_ConcretePage;
