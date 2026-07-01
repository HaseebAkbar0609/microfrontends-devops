"use client";

import { Heart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ActionsToolbar } from "@/components/common/ActionsToolbar";
import { OfferListTable } from "@/features/offer/components/OfferListTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { BREADCRUMBS, DUMMY_DATA } from "../constants";
import localizationConstants from "@/utils/translation/constants";

export default function OfferList() {
  const { search, changeQuery } = useQueryParams();

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
      <div className="p-5 flex-1">
        <OfferListTable data={DUMMY_DATA} totalItems={DUMMY_DATA.length} />
      </div>
    </div>
  );
}
