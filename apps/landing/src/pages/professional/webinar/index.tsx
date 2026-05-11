import {
  ProfessionalWebinarDiscover,
  ProfessionalWebinarOnlineMeeting,
  ProfessionalWebinarParticipate,
} from "@/components/professional/webinar";
import { WebinarProvider } from "@/contexts/webinar";
import { NextPage } from "next";
import Head from "next/head";

const ProfessionalWebinarPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Professional - Webinar</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <WebinarProvider>
          <ProfessionalWebinarDiscover />
          <ProfessionalWebinarParticipate />
          <ProfessionalWebinarOnlineMeeting />
        </WebinarProvider>
      </div>
    </>
  );
};

export default ProfessionalWebinarPage;
