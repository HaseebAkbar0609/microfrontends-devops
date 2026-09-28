"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsOverviewPage } from "@/features/financial-management/components/claims/ClaimsOverviewPage";
import type { ClaimTabType } from "@/features/financial-management/types/claims.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function ClaimsPageContent() {
	const searchParams = useSearchParams();
	const tabParam = (searchParams.get("tab") as ClaimTabType) || "reklamationerlista";

	return <ClaimsOverviewPage initialTab={tabParam} />;
}

export default function EconomyClaimsPage() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<ClaimsPageContent />
		</Suspense>
	);
}
