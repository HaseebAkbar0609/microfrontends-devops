import "@/styles/globals.css";
import "@/lib/i18n";
import type { AppProps } from "next/app";
import Layout from "@/components/common/layout/MainLayout";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Script from "next/script";
import { getSavedRegion, setRegionLanguage } from "@/components/site/regionUtils";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

interface CustomPageProps {
  hasHeader?: boolean;
}

export default function App({
  Component,
  pageProps,
}: AppProps & { pageProps: CustomPageProps }) {
  useEffect(() => {
    const saved = getSavedRegion();
    setRegionLanguage(saved);
  }, []);

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            id="ga4-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');`,
            }}
          />
        </>
      )}
      <Layout hasHeader={pageProps.hasHeader}>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </>
  );
}
