"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateClaimPage } from "@/features/financial-management/components/claims/create/CreateClaimPage";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function CreateClaimPageContent() {
	const searchParams = useSearchParams();
	const claimId = searchParams.get("id") || undefined;
	const templateId = searchParams.get("templateId") || undefined;

	return (
		<CreateClaimPage
			initialClaimId={claimId}
			initialTemplateId={templateId}
		/>
	);
}

export default function CreateClaimRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateClaimPageContent />
		</Suspense>
	);
}
