import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/common/layout/MainLayout";
import { ToastContainer } from "react-toastify";

interface CustomPageProps {
  hasHeader?: boolean;
}

export default function App({
  Component,
  pageProps,
}: AppProps & { pageProps: CustomPageProps }) {
  return (
    <>
      <Layout hasHeader={pageProps.hasHeader}>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </>
  );
}
