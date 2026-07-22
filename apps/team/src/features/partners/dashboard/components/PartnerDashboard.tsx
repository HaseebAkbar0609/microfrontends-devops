"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { CompanyProfileDetailsTab } from "./CompanyProfileDetailsTab";
import { LogotypeTab } from "./LogotypeTab";
import { OfferTab } from "./OfferTab";
import {
	partnerCompanyProfileSchema,
	type PartnerCompanyProfileFormValues,
} from "../schemas/companyProfile.schema";
import { DEFAULT_VALUES } from "../constants";

const MAIN_TABS = [
	{ value: "company-profile", label: localizationConstants.companyProfileTab },
	{ value: "offer", label: localizationConstants.partnerOfferTab },
	{ value: "image-bank", label: localizationConstants.imageBankTab },
];

const PROFILE_SUB_TABS = [
	{ value: "company-details", label: localizationConstants.adminCompanyInformation },
	{ value: "logotype", label: localizationConstants.logotypeTab },
];

function ComingSoonPanel() {
	return (
		<div className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-16 text-sm text-slate-500 shadow-sm">
			<Translate text={localizationConstants.comingSoon} />
		</div>
	);
}

export default function PartnerDashboard() {
	const t = useTranslate();
	const lastSavedRef = useRef<PartnerCompanyProfileFormValues | null>(DEFAULT_VALUES);
	const [activeMainTab, setActiveMainTab] = useState("company-profile");
	const [activeProfileTab, setActiveProfileTab] = useState("company-details");

	const form = useForm<PartnerCompanyProfileFormValues>({
		resolver: zodResolver(partnerCompanyProfileSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const onSubmit = async (data: PartnerCompanyProfileFormValues) => {
		lastSavedRef.current = data;
		showToast("success", t(localizationConstants.save));
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] flex-col px-6 pt-6">
			<div className="shrink-0">
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.partnerDashboardTitle} />
				</h1>
				<DynamicBreadcrumb
					items={[
						{ label: <Translate text={localizationConstants.partners} />, href: "/partners/dashboard" },
						{ label: <Translate text={localizationConstants.partnerDashboardItem} /> },
					]}
				/>
			</div>

			<Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="flex min-h-0 flex-1 flex-col">
				<div className="shrink-0 mt-6 border-b border-slate-200">
					<TabsList variant="line" className="h-auto gap-6 rounded-none px-0 pb-1">
						{MAIN_TABS.map((tab) => (
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

				<TabsContent value="company-profile" className="mt-6 min-h-0 flex-1">
					<Tabs
						value={activeProfileTab}
						onValueChange={setActiveProfileTab}
						className="flex h-full min-h-0 flex-col"
					>
						<div className="shrink-0 border-b border-slate-200">
							<TabsList variant="line" className="h-auto gap-6 rounded-none px-0 pb-1">
								{PROFILE_SUB_TABS.map((tab) => (
									<TabsTrigger
										key={tab.value}
										value={tab.value}
										className="px-0 text-sm text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
									>
										<Translate text={tab.label} />
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<TabsContent value="company-details" className="mt-6 min-h-0 flex-1">
							<CompanyProfileDetailsTab form={form} onSubmit={onSubmit} lastSavedRef={lastSavedRef} />
						</TabsContent>
						<TabsContent value="logotype" className="mt-6 min-h-0 flex-1">
							<LogotypeTab form={form} onSubmit={onSubmit} lastSavedRef={lastSavedRef} />
						</TabsContent>
					</Tabs>
				</TabsContent>

				<TabsContent value="offer" className="mt-6 min-h-0 flex-1">
					<OfferTab />
				</TabsContent>
				<TabsContent value="image-bank" className="mt-6 min-h-0 flex-1">
					<ComingSoonPanel />
				</TabsContent>
			</Tabs>
		</div>
	);
}
