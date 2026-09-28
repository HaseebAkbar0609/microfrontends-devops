"use client";

import { Suspense } from "react";
import { CreateCostCenterPage } from "@/features/financial-management/components/cost-centers/create/CreateCostCenterPage";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export const dynamic = "force-dynamic";

export default function Page() {
	return (
		<Suspense fallback={<div className="p-6 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
			<CreateCostCenterPage />
		</Suspense>
	);
}
