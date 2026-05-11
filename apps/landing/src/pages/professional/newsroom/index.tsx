import { NextPage } from "next";
import Head from "next/head";
import { NewsroomHero, NewsroomContent } from "@/components/professional/newsroom";

const NewsroomPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TimeFlowSystem - Nyhetsrum</title>
      </Head>

      <div className="w-full bg-white text-center md:text-left">
        <NewsroomHero />
        <NewsroomContent />
      </div>
    </>
  );
};

export default NewsroomPage;
