"use client";

import { useEffect, useState } from "react";
import { LogInIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listProfessionalsAPIAction } from "@/api-actions/companies/accounts";
import { ProfessionalRow } from "@/types/company";
import { authStorage } from "@/lib/authStorage";
import { Loader } from "@/components/ui/loader";
import { showToast } from "@/lib/toast";

export default function MyCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<ProfessionalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const result = await listProfessionalsAPIAction();
        setCompanies(result.items);
      } catch {
        showToast("error", "Failed to load companies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const handleCompanyLogin = (company: ProfessionalRow) => {
    authStorage.setCompanyData(company);
    router.push("/home");
  };

  return (
    <div className="w-full bg-background rounded-[10px] shadow-sm overflow-hidden flex flex-col md:flex-row flex-1 min-h-0">
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-12 py-16 md:flex">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
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
            <Button variant="outlinePrimary" className="cursor-pointer" onClick={() => router.push("/register")}>
              <Plus className="h-4 w-4" aria-hidden />
              <Translate text={localizationConstants.myCompaniesCreateNew} />
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader />
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No active companies found.
              </div>
            ) : (
              <ul className="space-y-4 pb-2">
                {companies.map((company) => (
                  <li
                    key={company.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 relative">
                      <span className="font-semibold text-lg text-gray-900 flex-1">
                        {company.companyName}
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
                      onClick={() => handleCompanyLogin(company)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <LogInIcon className="h-4 w-4" aria-hidden />
                        <Translate text={localizationConstants.myCompaniesLogIn} />
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
