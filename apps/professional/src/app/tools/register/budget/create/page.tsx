"use client";

import { Suspense } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CreateBudgetPage } from "@/features/tools/register/components/CreateBudgetPage";

function CreateBudgetContent() {
	return <CreateBudgetPage />;
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.genericLoading} />
				</div>
			}
		>
			<CreateBudgetContent />
		</Suspense>
	);
}
