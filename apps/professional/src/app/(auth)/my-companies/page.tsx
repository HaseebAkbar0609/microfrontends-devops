"use client";

import { LogInIcon, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { redirect } from "next/navigation";

const MOCK_COMPANIES = [
  { id: "1", name: "Test Company 1" },
  { id: "2", name: "Test Company 2" },
  { id: "3", name: "Test Company 3" },
] as const;

export default function MyCompaniesPage() {
  const handleCompanyLogin = (companyId: string) => {
    console.log("Log in to company:", companyId);
  };

  return (
    <div className="w-full bg-background rounded-[10px] shadow-sm overflow-hidden flex flex-col md:flex-row flex-1 min-h-0">
      <div className="relative w-full md:w-1/2 flex items-center justify-center  p-12 py-16 md:flex">
        <div className="relative w-full h-full  overflow-hidden rounded-lg">
          <Image
            src="/my-companies-banner.png"
            alt="TimeFlow My companies"
            fill
            className="object-contain m-auto "
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col min-h-0">
        <div className="w-full 2xl:max-w-[600px] max-w-full mx-auto flex flex-col min-h-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-700 mb-2 tracking-tight">
                <Translate text={localizationConstants.myCompaniesTitle} />
              </h1>
              <p className="text-[13px] text-gray-500 tracking-wide">
                <Translate text={localizationConstants.myCompaniesSubtitle} />
              </p>
            </div>
            <Button variant="outlinePrimary" className="cursor-pointer" onClick={() => redirect("/register")}>
              <Plus className="h-4 w-4" aria-hidden />
              <Translate text={localizationConstants.myCompaniesCreateNew} />
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="space-y-4 pb-2">
              {MOCK_COMPANIES.map((company) => (
                <li
                  key={company.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-3 relative">
                    <span className="font-semibold text-lg text-gray-900 flex-1">
                      {company.name}
                    </span>
                    <Image
                      src="/flag-icon.png"
                      alt="flag"
                      width={80}
                      height={50}
                      className="object-contain w-20"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full max-w-1/2"
                    onClick={() => handleCompanyLogin(company.id)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LogInIcon className="h-4 w-4" aria-hidden />
                      <Translate text={localizationConstants.myCompaniesLogIn} />
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
