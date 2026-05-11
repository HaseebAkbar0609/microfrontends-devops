import {
  CleaningMaintenanceHero,
  CleaningMaintenanceContent,
} from "@/components/consumer/cleaning-maintenance";
import { NextPage } from "next";
import Head from "next/head";

const CleaningMaintenancePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - CleaningMaintenance</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        <CleaningMaintenanceHero />
        <CleaningMaintenanceContent />
      </div>
    </>
  );
};

export default CleaningMaintenancePage;
