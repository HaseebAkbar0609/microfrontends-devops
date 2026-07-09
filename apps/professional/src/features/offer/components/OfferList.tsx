"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ActionsToolbar } from "@/components/common/ActionsToolbar";
import { OfferListTable } from "@/features/offer/components/OfferListTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { BREADCRUMBS } from "../constants";
import localizationConstants from "@/utils/translation/constants";
import { listOffersAPIAction } from "@/api-actions/offers";
import { OfferList as OfferListType } from "../types";
import { Loader } from "@/components/ui/loader";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";
import { showToast } from "@/lib/toast";

export default function OfferList() {
  const { search, changeQuery, page = 1, query } = useQueryParams();
  const page_size = query.get("page_size") || "10";
  const [offers, setOffers] = useState<OfferListType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true);
      try {
        const companyData = authStorage.getCompanyData() as ProfessionalRow | null;
        
        const result = await listOffersAPIAction({ 
          status: "REQUESTED",
          page: Number(page) || 1,
          pageSize: Number(page_size) || 10,
          search: search,
          companyId: companyData?.id,
        });
        setOffers(result.items);
        setTotalItems(result.totalItems);
      } catch (error) {
        showToast("error", "Failed to load offers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOffers();
  }, [search, page, page_size]);

  return (
    <div className="flex flex-1 flex-col bg-blue-gray-50">
      <PageHeader
        title={localizationConstants.offer}
        breadcrumbs={BREADCRUMBS}
      />
      <ActionsToolbar
        searchValue={search}
        onSearchChange={(val) => changeQuery("search", val)}
        createButtonLabel="Favourite jobs"
        createButtonIcon={Heart}
        onCreateClick={() => {}}
      />
      <div className="p-5 flex-1 relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <OfferListTable data={offers} totalItems={totalItems} />
        )}
      </div>
    </div>
  );
}
