import { ConsumerFaqContent, ConsumerFaqHero } from "@/components/consumer/faq";
import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const ConsumerFaqPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("seo.consumerFaqTitle")}</title>
        <meta name="description" content={t("seo.consumerFaqDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t("seo.consumerFaqOgTitle")} />
        <meta property="og:description" content={t("seo.consumerFaqOgDesc")} />
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <ConsumerFaqHero />
        <ConsumerFaqContent />
      </div>
    </>
  );
};

export default ConsumerFaqPage;
