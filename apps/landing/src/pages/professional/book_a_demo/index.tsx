import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { CALENDLY_DEMO_URL } from "@/utils/constants";

/**
 * This page immediately redirects to Calendly via getServerSideProps.
 * The component below is a minimal fallback that should never be visible.
 */
const ProfessionalDemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Boka demo</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-body">
        <p className="text-muted text-sm">Redirecting to booking…</p>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: CALENDLY_DEMO_URL,
      permanent: false,
    },
  };
};

export default ProfessionalDemoPage;
