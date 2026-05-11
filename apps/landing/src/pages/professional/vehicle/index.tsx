import {
  ProfessionalVehicleHero,
  ProfessionalVehicleContent,
} from "@/components/professional/vehicle";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalVehiclePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Fordon</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        {/* <ProfessionalVehicleHero /> */}
        <ProfessionalVehicleContent />
      </div>
    </>
  );
};

export default ProfessionalVehiclePage;