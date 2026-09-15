"use client";

import React, { Suspense } from "react";
import { CreateAuthorityPage } from "@/features/financial-management/components/authorities/create";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function CreateAuthorityRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateAuthorityPage />
		</Suspense>
	);
}
