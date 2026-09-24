"use client";

import { useCallback, useEffect, useState } from "react";
import { LogInIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listAllProfessionalsAPIAction } from "@/api-actions/companies/accounts";
import { ProfessionalRow } from "@/types/company";
import { authStorage } from "@/lib/authStorage";
import { Loader } from "@/components/ui/loader";
import { setRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";
import { getSubscriptionOverview } from "@/features/admin/subscription/services/subscriptionService";
import { useAuthStatus } from "@/context/AuthContext";

export default function MyCompaniesPage() {
  const router = useRouter();
  const { setCompany } = useAuthStatus();
  const [companies, setCompanies] = useState<ProfessionalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setHasLoadError(false);
    try {
      const result = await listAllProfessionalsAPIAction();
      setCompanies(result.items);
    } catch {
      setCompanies([]);
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const handleCompanyLogin = async (company: ProfessionalRow) => {
    setSelectedCompanyId(company.id);
    authStorage.setCompanyData(company);
    setCompany(company);
    try {
      const overview = await getSubscriptionOverview();
      const requiresSubscription = overview.status?.access_state === "INACTIVE";
      setRequiresSubscriptionCookie(requiresSubscription);
      router.replace(requiresSubscription ? "/manage-plans" : "/home");
    } catch {
      // Do not keep a stale company-specific billing cookie after switching.
      setRequiresSubscriptionCookie(false);
      router.replace("/home");
    }
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
            ) : hasLoadError ? (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
                <p className="text-sm text-red-700">
                  <Translate text={localizationConstants.myCompaniesLoadError} />
                </p>
                <Button type="button" variant="outline" onClick={() => void fetchCompanies()}>
                  <Translate text={localizationConstants.retry} />
                </Button>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Translate text={localizationConstants.myCompaniesEmpty} />
              </div>
            ) : (
              <ul className="space-y-4 pb-2">
                {companies.map((company) => (
                  <li
                    key={company.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                  >
                    <div className="mb-4 space-y-2">
                      <span className="block font-semibold text-lg text-gray-900">
                        {company.companyName}
                      </span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        {company.orgNo && <span>{company.orgNo}</span>}
                        {company.category && <span>{company.category}</span>}
                        {company.city && <span>{company.city}</span>}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full"
                      disabled={selectedCompanyId !== null}
                      onClick={() => void handleCompanyLogin(company)}
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
