import DynamicModulePage from "../[slug]";
import { findModule } from "@/lib/modules";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const slug = "b2b";
const found = findModule(slug);

export default function ProfessionalB2bPagePage() {
  if (!found) return null;
  const { t } = useTranslation();

  return (
    <>
    <Head>
      <title>{t("seo.professionalB2bTitle")}</title>
      <meta name="description" content={t("seo.professionalB2bDesc")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={t("seo.professionalB2bOgTitle")} />
      <meta property="og:description" content={t("seo.professionalB2bOgDesc")} />
    </Head>
    <DynamicModulePage slug={slug} item={found.item} section={found.section} />;
    </>
  );
};

export const getStaticProps = async () => ({ props: { hasHeader: false } });
