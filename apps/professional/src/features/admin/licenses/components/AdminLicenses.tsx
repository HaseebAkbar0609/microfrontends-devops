"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	LICENSE_TAB_IDS,
	LICENSE_TABS,
	LicenseTabId,
} from "../constants/mockData";
import { useLicenseCart } from "../hooks/useLicenseCart";
import { listLicensePackages } from "../services/licenseService";
import LicenseCartPanel from "./LicenseCartPanel";
import LicensePackageCard from "./LicensePackageCard";

const isLicenseTabId = (value: string | null): value is LicenseTabId =>
	LICENSE_TAB_IDS.includes(value as LicenseTabId);

const AdminLicenses = () => {
	const t = useTranslate();
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: LicenseTabId = isLicenseTabId(tabParam)
		? tabParam
		: "system";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "system" ? null : value });

	const [search, setSearch] = useState("");
	const {
		items,
		paymentCycle,
		setPaymentCycle,
		changeQuantity,
		addPackage,
		clearCart,
		total,
	} = useLicenseCart();

	const packages = useMemo(() => {
		const term = search.trim().toLowerCase();
		const all = listLicensePackages(activeTab);
		if (!term) return all;
		return all.filter((pkg) => pkg.name.toLowerCase().includes(term));
	}, [activeTab, search]);

	return (
		<div className="flex min-h-full flex-col gap-6 p-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900 mb-2">
						<Translate
							text={localizationConstants.adminLicensesTitle}
						/>
					</h1>
					<DynamicBreadcrumb
						variant="small"
						items={[
							{
								translationKey: localizationConstants.adminItem,
								href: "/admin/settings",
							},
							{
								translationKey:
									localizationConstants.adminLicensesTitle,
							},
						]}
					/>
				</div>
				<div className="relative w-full max-w-xs">
					<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
					/>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<div className="border-b border-slate-200">
					<TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
						{LICENSE_TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</Tabs>

			<div className="grid flex-1 grid-cols-12 items-start gap-6">
				<div className="col-span-12 flex flex-col gap-5 xl:col-span-8">
					{packages.map((pkg) => (
						<LicensePackageCard
							key={pkg.id}
							pkg={pkg}
							onAdd={addPackage}
						/>
					))}
				</div>
				<div className="col-span-12 xl:col-span-4">
					<LicenseCartPanel
						items={items}
						total={total}
						paymentCycle={paymentCycle}
						onPaymentCycleChange={setPaymentCycle}
						onQuantityChange={changeQuantity}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-slate-200 pt-4">
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={clearCart}
						className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<Translate
							text={localizationConstants.licensesCancelAction}
						/>
					</Button>
					<Button
						type="button"
						variant="secondary"
						className="h-10 rounded-md bg-slate-100 px-5 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Translate
							text={localizationConstants.licensesAcceptAction}
						/>
					</Button>
				</div>
				<Button
					type="button"
					className="h-10 gap-1.5 rounded-md bg-[#18181B] px-5 text-sm font-medium text-white hover:bg-[#18181B]/90"
				>
					<Translate
						text={localizationConstants.licensesNextAction}
					/>
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

export default AdminLicenses;
