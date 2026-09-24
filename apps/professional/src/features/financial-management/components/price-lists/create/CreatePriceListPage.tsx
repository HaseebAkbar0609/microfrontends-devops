"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CreatePriceListWizard } from "./CreatePriceListWizard";
import { PRICE_LISTS_BASE_ROUTE } from "../../../constants/priceLists.constants";

export function CreatePriceListPage() {
	const router = useRouter();

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Bar with Back Button */}
			<div className="flex items-center gap-3">
				<Button
					variant="ghost"
					onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
					className="h-9 px-2 text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="text-xs font-medium">
						<Translate text={localizationConstants.priceListGoBackLabel} />
					</span>
				</Button>
			</div>

			{/* Page Heading */}
			<div>
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
