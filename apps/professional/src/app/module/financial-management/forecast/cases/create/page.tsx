import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CreateCasePage } from "@/features/financial-management/components/cases/create";
import { FORECAST_CASES_BASE_ROUTE } from "@/features/financial-management/constants/cases.constants";

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center p-12 text-slate-400">
					<Loader2 className="w-5 h-5 animate-spin" />
				</div>
			}
		>
			<CreateCasePage basePath={FORECAST_CASES_BASE_ROUTE} />
		</Suspense>
	);
}
