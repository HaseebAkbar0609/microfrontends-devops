"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	LICENSE_CATEGORIES,
	LICENSE_TAB_HEADINGS,
	LICENSE_TAB_IDS,
	LICENSE_TABS,
	LicenseCategoryId,
	LicensePackage,
	LicenseTabId,
} from "../constants/licenseCatalog.constants";
import { useLicenseCart } from "../hooks/useLicenseCart";
import { useLicenseCatalog } from "../hooks/useLicenseCatalog";
import LicenseCartPanel from "./LicenseCartPanel";
import LicensePackageCard from "./LicensePackageCard";

const isLicenseTabId = (value: string | null): value is LicenseTabId =>
	LICENSE_TAB_IDS.includes(value as LicenseTabId);

const ModuleCategorySidebar = ({
	activeCategory,
	onSelect,
}: {
	activeCategory: LicenseCategoryId | "all";
	onSelect: (category: LicenseCategoryId | "all") => void;
}) => (
	<div className="rounded-md border border-slate-200 bg-white p-4">
		<p className="text-lg font-semibold text-slate-800">
			<Translate
				text={localizationConstants.licensesModuleSidebarTitle}
			/>
		</p>
		<div className="mt-3 flex flex-col gap-1">
			<button
				type="button"
				onClick={() => onSelect("all")}
				className={cn(
					"cursor-pointer rounded-md px-3 py-2 text-left text-sm text-slate-700",
					activeCategory === "all"
						? "bg-slate-100 font-medium text-slate-900"
						: "hover:bg-slate-50",
				)}
			>
				<Translate text={localizationConstants.licensesModuleAll} />
			</button>
			{LICENSE_CATEGORIES.map((category) => (
				<button
					key={category.id}
					type="button"
					onClick={() => onSelect(category.id)}
					className={cn(
						"cursor-pointer rounded-md px-3 py-2 text-left text-sm text-slate-700",
						activeCategory === category.id
							? "bg-slate-100 font-medium text-slate-900"
							: "hover:bg-slate-50",
					)}
				>
					<Translate text={category.label} />
				</button>
			))}
		</div>
	</div>
);

const AdminLicenses = () => {
	const t = useTranslate();
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: LicenseTabId = isLicenseTabId(tabParam)
		? tabParam
		: "system";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "system" ? null : value });

	const tabIndex = LICENSE_TAB_IDS.indexOf(activeTab);
	const isFirstTab = tabIndex === 0;
	const isLastTab = tabIndex === LICENSE_TAB_IDS.length - 1;
	const goToTab = (offset: number) => {
		const next = LICENSE_TAB_IDS[tabIndex + offset];
		if (next) setActiveTab(next);
	};

	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<
		LicenseCategoryId | "all"
	>("all");
	const {
		items,
		paymentCycle,
		setPaymentCycle,
		changeQuantity,
		addPackage,
		clearCart,
		total,
		checkoutMutation,
	} = useLicenseCart();

	const handleCheckout = () => {
		if (items.length === 0) {
			showToast("error", "Your cart is empty");
			return;
		}
		checkoutMutation.mutate({
			items: items.map(item => ({
				plan_key: item.id,
				quantity: item.quantity
			}))
		});
	};

	const catalog = useLicenseCatalog();
	const packages = useMemo(() => {
		const term = search.trim().toLowerCase();
		const all = catalog.data?.[activeTab] ?? [];
		if (!term) return all;
		return all.filter((pkg) => pkg.name.toLowerCase().includes(term));
	}, [catalog.data, activeTab, search]);

	const handleAdd = (
		pkg: LicensePackage,
		selection: Parameters<typeof addPackage>[2],
	) => addPackage(pkg, activeTab, selection);

	const heading = LICENSE_TAB_HEADINGS[activeTab];
	const isSystemAddonTab = activeTab === "addonSystem";

	const visibleCategories = LICENSE_CATEGORIES.filter(
		(category) =>
			(activeCategory === "all" || activeCategory === category.id) &&
			packages.some((pkg) => pkg.categoryId === category.id),
	);

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

			{heading && (
				<h2 className="-mb-2 text-lg font-semibold text-slate-600">
					<Translate text={heading} />
				</h2>
			)}

			<div className="grid flex-1 grid-cols-12 items-start gap-6">
				{isSystemAddonTab && (
					<div className="col-span-12 md:col-span-3 xl:col-span-2">
						<ModuleCategorySidebar
							activeCategory={activeCategory}
							onSelect={setActiveCategory}
						/>
					</div>
				)}

				<div
					className={cn(
						"col-span-12 flex flex-col gap-5",
						isSystemAddonTab
							? "md:col-span-9 xl:col-span-6"
							: "xl:col-span-8",
					)}
				>
					{catalog.isLoading ? (
						<div
							role="status"
							className="flex flex-col items-center gap-3 rounded-md border border-slate-200 bg-white py-16 text-sm text-slate-500"
						>
							<Loader2 className="h-5 w-5 animate-spin" />
							<Translate
								text={localizationConstants.licensesCatalogLoading}
							/>
						</div>
					) : catalog.isError ? (
						<div className="flex flex-col items-center gap-3 rounded-md border border-slate-200 bg-white py-16 text-sm text-slate-500">
							<p>
								<Translate
									text={localizationConstants.licensesCatalogError}
								/>
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => catalog.refetch()}
								className="gap-1.5"
							>
								<RefreshCw className="h-3.5 w-3.5" />
								<Translate
									text={localizationConstants.licensesCatalogRetry}
								/>
							</Button>
						</div>
					) : packages.length === 0 ? (
						<div className="rounded-md border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
							<Translate
								text={localizationConstants.licensesCatalogEmpty}
							/>
						</div>
					) : isSystemAddonTab ? (
						visibleCategories.map((category) => (
							<div key={category.id} className="flex flex-col gap-4">
								<h3 className="text-base font-semibold text-slate-600">
									<Translate text={category.label} />
								</h3>
								{packages
									.filter(
										(pkg) => pkg.categoryId === category.id,
									)
									.map((pkg) => (
										<LicensePackageCard
											key={pkg.id}
											pkg={pkg}
											onAdd={handleAdd}
										/>
									))}
							</div>
						))
					) : (
						packages.map((pkg) => (
							<LicensePackageCard
								key={pkg.id}
								pkg={pkg}
								onAdd={handleAdd}
							/>
						))
					)}
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

			<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
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
					{!isLastTab && (
						<Button
							type="button"
							variant="secondary"
							className="h-10 rounded-md bg-slate-100 px-5 text-sm font-medium text-slate-900 hover:bg-slate-200"
						>
							<Translate
								text={
									localizationConstants.licensesAcceptAction
								}
							/>
						</Button>
					)}
				</div>
				<div className="flex items-center gap-3">
					{!isFirstTab && (
						<Button
							type="button"
							variant="outline"
							onClick={() => goToTab(-1)}
							className="h-10 gap-1.5 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
						>
							<ArrowLeft className="h-4 w-4" />
							<Translate
								text={localizationConstants.licensesBackAction}
							/>
						</Button>
					)}
					{isLastTab ? (
						<Button
							type="button"
							onClick={handleCheckout}
							disabled={checkoutMutation.isPending}
							className="h-10 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Translate
								text={
									localizationConstants.licensesAcceptAction
								}
							/>
						</Button>
					) : (
						<Button
							type="button"
							onClick={() => goToTab(1)}
							className="h-10 gap-1.5 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Translate
								text={localizationConstants.licensesNextAction}
							/>
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminLicenses;
