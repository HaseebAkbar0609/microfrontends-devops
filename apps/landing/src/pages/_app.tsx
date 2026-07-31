import "@/styles/globals.css";
import "@/lib/i18n";
import type { AppProps } from "next/app";
import Layout from "@/components/common/layout/MainLayout";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { getSavedRegion, setRegionLanguage } from "@/components/site/regionUtils";

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
      <Layout hasHeader={pageProps.hasHeader}>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </>
  );
}
