import {
  ProfessionalCleaning_MaintenanceContent,
} from "@/components/professional/Cleaning_Maintenance";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalCleaning_MaintenancePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Cleaning_Maintenance</title>
      </Head>
      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalCleaning_MaintenanceHero /> */}
        <ProfessionalCleaning_MaintenanceContent />
      </div>
    </>
  );
};

export default ProfessionalCleaning_MaintenancePage;
