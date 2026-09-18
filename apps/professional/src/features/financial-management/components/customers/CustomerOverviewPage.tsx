"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { CustomerOverviewTable } from "./CustomerOverviewTable";

export function CustomerOverviewPage() {
	const { t } = useTranslation();
	const router = useRouter();

	const handleRegisterChange = (value: string) => {
		if (value === "supplier") {
			router.push("/module/financial-management/economy/suppliers");
		} else if (value === "artikel") {
			router.push("/module/financial-management/economy/articles");
		} else {
			router.push("/module/financial-management/economy/customers");
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50/50 min-h-screen">
			{/* Register Section Dropdown Selector matching Figma */}
			<div className="flex flex-col gap-2 w-full lg:w-1/3 xl:w-1/4">
				<label className="text-xs font-medium text-slate-700">
					<Translate text={localizationConstants.registerDropdownLabel} />
				</label>
				<Select value="kund" onValueChange={handleRegisterChange}>
					<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
						<SelectValue placeholder={t(localizationConstants.selectRegisterPlaceholder)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						<SelectItem
							value="kund"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.customerOption} />
						</SelectItem>
						<SelectItem
							value="supplier"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.supplierOption} />
						</SelectItem>
						<SelectItem
							value="artikel"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.articleOption} />
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Sub Tabs Bar with Kundlista */}
			<div className="border-b border-slate-200">
				<Tabs value="kundlista">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="kundlista" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.customerListTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Customer Table Content */}
			<Suspense
				fallback={
					<div className="py-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.genericLoading} />
					</div>
				}
			>
				<CustomerOverviewTable />
			</Suspense>
		</div>
	);
}
