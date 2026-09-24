"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateClaimTemplatePage } from "@/features/financial-management/components/claims/templates/create";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function CreateClaimTemplatePageContent() {
	const searchParams = useSearchParams();
	let templateId = searchParams.get("id") || undefined;

	// Fallback to window.location.hash in case a route was accessed with unencoded `?id=#MA001`
	if (typeof window !== "undefined" && (!templateId || templateId.trim() === "")) {
		const hash = window.location.hash;
		if (hash && hash.length > 1) {
			templateId = hash;
		}
	}

	if (templateId) {
		try {
			templateId = decodeURIComponent(templateId);
		} catch {
			// keep as is
		}
	}

	return <CreateClaimTemplatePage initialTemplateId={templateId} />;
}

export default function CreateClaimTemplateRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateClaimTemplatePageContent />
		</Suspense>
	);
}
