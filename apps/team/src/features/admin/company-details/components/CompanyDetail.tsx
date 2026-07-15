"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { CompanyInformationTab } from "./CompanyInformationTab";
import { BankTab } from "./BankTab";
import { OrganisationTab } from "./OrganisationTab";
import {
	companyInformationSchema,
	type CompanyInformationFormValues,
} from "../schemas/companyInformation.schema";
import { DEFAULT_VALUES } from "../constants";

const TABS = [
	{ value: "company", label: localizationConstants.adminCompanyInfoTab },
	{ value: "bank", label: localizationConstants.adminBankTab },
	{ value: "organisation", label: localizationConstants.adminOrganisationTab },
];

export default function CompanyDetail() {
	const t = useTranslate();
	const lastSavedRef = useRef<CompanyInformationFormValues | null>(DEFAULT_VALUES);
	const [activeTab, setActiveTab] = useState("company");

	const form = useForm<CompanyInformationFormValues>({
		resolver: zodResolver(companyInformationSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const onSubmit = async (data: CompanyInformationFormValues) => {
		lastSavedRef.current = data;
		showToast("success", t(localizationConstants.save));
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] flex-col gap-6 px-6 py-6">
			<div>
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.adminCompanyInformation} />
				</h1>
				<DynamicBreadcrumb
					items={[
						{ label: <Translate text={localizationConstants.adminItem} />, href: "/admin" },
						{ label: <Translate text={localizationConstants.adminCompanyInformation} /> },
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<div className="border-b border-slate-200">
					<TabsList variant="line" className="h-auto gap-6 rounded-none px-0 pb-1">
						{TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="px-0 text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="company" className="mt-6">
					<CompanyInformationTab form={form} onSubmit={onSubmit} lastSavedRef={lastSavedRef} />
				</TabsContent>
				<TabsContent value="bank" className="mt-6">
					<BankTab />
				</TabsContent>
				<TabsContent value="organisation" className="mt-6">
					<OrganisationTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
