import "@/styles/globals.css";
import "@/lib/i18n";
import type { AppProps } from "next/app";
import Layout from "@/components/common/layout/MainLayout";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Script from "next/script";
import { getSavedRegion, setRegionLanguage } from "@/components/site/regionUtils";

const KLAVIYO_INIT_SCRIPT = `!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`;

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
      <Script
        id="klaviyo-loader"
        strategy="afterInteractive"
        src="https://static.klaviyo.com/onsite/js/W8gF3H/klaviyo.js?company_id=W8gF3H"
      />
      <Script
        id="klaviyo-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: KLAVIYO_INIT_SCRIPT }}
      />
      <Layout hasHeader={pageProps.hasHeader}>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </>
  );
}
