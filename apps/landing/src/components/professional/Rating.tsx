"use client";

import { Star } from "../icons";
import Link from "next/link";
import Script from "next/script";
import { useEffect } from "react";

const ProfessionalRating: React.FC = () => {
  useEffect(() => {
    const el = document.getElementById("trustpilot-widget");
    if (window.Trustpilot && el) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <div className="mt-10 md:mt-20 bg-[#F5F5F5]">
      <div className="flex flex-col container mx-auto px-4 items-center pb-10 pt-12 md:pt-20 gap-9">
        <h1 className="font-bold header-primary-size">
          Betrodd av 1000-tals entreprenörer
        </h1>

        <div className="w-full flex justify-center">
          <div
            id="trustpilot-widget"
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="664f5659a9eea31f7a97ecd0"
            data-style-height="52px"
            data-style-width="100%"
            data-token="3f0c526e-f9f3-4609-8ee7-a486c9b547bb"
          >
            <a
              href="https://www.trustpilot.com/review/timeflowsystem.se"
              target="_blank"
              rel="noopener"
            >
              Trustpilot
            </a>
          </div>

          <Script
            src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
            strategy="lazyOnload"
          />
        </div>
      </div>

      {/* Webinar section */}
      <div className="bg-primary-500 px-4 text-white text-center pt-10 pb-5">
        <div className="container mx-auto">
          <h1 className="font-bold header-primary-size">Anmäl dig till webinar</h1>
          <p className="text-base md:content-primary-size mt-6">
            Lär dig på 20 minuter hur du kan effektivisera din vardag med
            TimeFlow – helt gratis.
          </p>
          <Link href="/professional/webinar/">
            <button className="mt-6 font-bold text-sm rounded-md bg-[#0C0C0D] text-white px-6 py-3 transition-colors duration-200 cursor-pointer">
              BOKA HÄR
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRating;
