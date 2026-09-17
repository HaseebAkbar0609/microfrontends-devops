import {
  ProfessionalGoodsContent,
} from "@/components/professional/Goods";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ProfessionalGoodsPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.professionalGoodsTitle")}</title>
        <meta name="description" content={t("seo.professionalGoodsDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.professionalGoodsOgTitle")} />
        <meta property="og:description" content={t("seo.professionalGoodsOgDesc")} />
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalGoodsHero /> */}
        <ProfessionalGoodsContent />
      </div>
    </>
  );
};

export default ProfessionalGoodsPage;
