"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CreatePriceListWizard } from "./CreatePriceListWizard";
import { PRICE_LISTS_BASE_ROUTE } from "../../../constants/priceLists.constants";

export function CreatePriceListPage() {
	const router = useRouter();

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Bar with Back Arrow & Heading matching Figma Image 5 */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
					className="text-slate-800 hover:text-slate-900 transition-colors cursor-pointer p-0.5"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.createPriceListTitle} />
				</h1>
			</div>

			{/* Form Wizard */}
			<CreatePriceListWizard />
		</div>
	);
}

export default CreatePriceListPage;
