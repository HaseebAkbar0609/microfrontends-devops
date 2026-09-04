"use client";

import { Suspense } from "react";
import { CreateWageTypePage } from "@/features/tools/register/components/CreateWageTypePage";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<Suspense fallback={<div className="p-6 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
			<CreateWageTypePage />
		</Suspense>
	);
}
