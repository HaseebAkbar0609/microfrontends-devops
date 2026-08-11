"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { ComingSoonTab } from "./ComingSoonTab";
import { CompanyBankTab } from "./CompanyBankTab";
import { CompanyInformationTab } from "./CompanyInformationTab";
import { CompanyLogotypeTab } from "./CompanyLogotypeTab";
import { CompanyPresentationTab } from "./CompanyPresentationTab";
import { CompanyReferencesTab } from "./CompanyReferencesTab";
import {
	companyInformationSchema,
	type CompanyInformationFormValues,
} from "../schemas/companyInformation.schema";
import { DEFAULT_VALUES } from "../constants";
import {
	useCompanyInformation,
	useUpdateCompanyInformation,
} from "../hooks/useCompanyInformation";
import { DynamicBreadcrumb } from "@/components/common";

const tabs = [
	{
		value: "company",
		label: localizationConstants.companyInformation,
		isComingSoon: false,
	},
	{ value: "bank", label: localizationConstants.bank, isComingSoon: false },
	{
		value: "logotype",
		label: localizationConstants.logotype,
		isComingSoon: false,
	},
	{
		value: "presentation",
		label: localizationConstants.presentation,
		isComingSoon: false,
	},
	{
		value: "reference-list",
		label: localizationConstants.referenceList,
		isComingSoon: false,
	},
	{
		value: "reviews",
		label: localizationConstants.reviews,
		isComingSoon: true,
	},
	{
		value: "lead-management",
		label: localizationConstants.leadManagement,
		isComingSoon: true,
	},
];

const DEFAULT_TAB = "company";

const tabFromHash = () => {
	const hash = window.location.hash.replace("#", "");
	return tabs.some((tab) => tab.value === hash) ? hash : DEFAULT_TAB;
};

export default function CompanyDetail() {
	const lastSavedRef = useRef<CompanyInformationFormValues | null>(null);
	const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

	useEffect(() => {
		setActiveTab(tabFromHash());
		const onHashChange = () => setActiveTab(tabFromHash());
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		window.history.replaceState(
			null,
			"",
			value === DEFAULT_TAB
				? window.location.pathname + window.location.search
				: `#${value}`,
		);
	};

	const form = useForm<CompanyInformationFormValues>({
		resolver: zodResolver(companyInformationSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const companyInformationQuery = useCompanyInformation();
	const updateCompanyInformation = useUpdateCompanyInformation();

	const queryClient = useQueryClient();

	const onSubmit = async (data: CompanyInformationFormValues) => {
		try {
			await updateCompanyInformation.mutateAsync(data);
			await queryClient.invalidateQueries({
				queryKey: ["company-information"],
			});
			lastSavedRef.current = data;
			showToast("success", localizationConstants.profileUpdated);
		} catch (_error) {
			showToast("error", localizationConstants.profileUpdateFailed);
		}
	};

	useEffect(() => {
		if (!companyInformationQuery.data) {
			return;
		}

		const incoming =
			companyInformationQuery.data as Partial<CompanyInformationFormValues>;
		const merged: CompanyInformationFormValues = {
			...DEFAULT_VALUES,
			...incoming,
			postalAddress: {
				...DEFAULT_VALUES.postalAddress,
				...incoming.postalAddress,
			},
			visitingAddress: {
				...DEFAULT_VALUES.visitingAddress,
				...incoming.visitingAddress,
			},
			deliveryAddress: {
				...DEFAULT_VALUES.deliveryAddress,
				...incoming.deliveryAddress,
			},
		};

		form.reset(merged);
		lastSavedRef.current = merged;
	}, [companyInformationQuery.data, form]);

	return (
		<div className="flex min-h-[calc(100vh-180px)] flex-col gap-6 px-6 py-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900 mb-2">
					<Translate
						text={localizationConstants.companyInformation}
					/>
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.adminItem,
							href: "/admin",
						},
						{
							translationKey:
								localizationConstants.companyInformation,
						},
					]}
				/>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<div className="border-b border-slate-200">
					<TabsList
						variant="line"
						className="h-auto gap-6 rounded-none px-0 pb-1"
					>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="px-0 text-slate-400 data-[state=active]:px-5 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{tabs.map((tab) =>
					tab.value === "company" ? (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<CompanyInformationTab
								form={form}
								onSubmit={onSubmit}
								lastSavedRef={lastSavedRef}
							/>
						</TabsContent>
					) : tab.value === "logotype" ? (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<CompanyLogotypeTab
								form={form}
								onSubmit={onSubmit}
								lastSavedRef={lastSavedRef}
							/>
						</TabsContent>
					) : tab.value === "bank" ? (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<CompanyBankTab />
						</TabsContent>
					) : tab.value === "presentation" ? (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<CompanyPresentationTab />
						</TabsContent>
					) : tab.value === "reference-list" ? (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<CompanyReferencesTab />
						</TabsContent>
					) : (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="mt-6"
						>
							<ComingSoonTab />
						</TabsContent>
					),
				)}
			</Tabs>
		</div>
	);
}
