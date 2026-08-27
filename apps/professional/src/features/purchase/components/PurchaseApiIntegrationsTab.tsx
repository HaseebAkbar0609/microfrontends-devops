"use client";

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LabeledCheckbox } from "@/components/common/LabeledCheckbox";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { usePurchaseApiIntegrations } from "../hooks/usePurchaseApiIntegrations";
import type { PurchaseApiSupplier } from "../types/purchase.types";

/** Grey-headed section card, the same treatment the admin integration cards use. */
function SectionCard({
	title,
	action,
	children,
}: {
	title: TranslationKeys;
	action?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<section className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<header className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-5 py-3">
				<h2 className="text-base font-semibold text-slate-700">
					<Translate text={title} />
				</h2>
				{action}
			</header>
			<div className="flex flex-col gap-3 px-5 py-4">{children}</div>
		</section>
	);
}

/** One supplier row: a bordered card wrapping the shared labelled checkbox. */
function SupplierRow({
	supplier,
	onToggle,
}: {
	supplier: PurchaseApiSupplier;
	onToggle: (next: boolean) => void;
}) {
	return (
		<div className="rounded-md border border-slate-200 bg-white px-4 py-3">
			<LabeledCheckbox
				variant="secondary"
				checked={supplier.connected}
				onChange={onToggle}
				label={supplier.name}
				labelClassName="text-sm font-normal text-slate-900"
			/>
		</div>
	);
}

export function PurchaseApiIntegrationsTab() {
	const { t } = useTranslation();
	const { categories, toConnect, connected, setConnected } =
		usePurchaseApiIntegrations();

	const handleToggle = useCallback(
		(supplier: PurchaseApiSupplier, next: boolean) => {
			setConnected(supplier.id, next);
			showToast(
				next ? "success" : "info",
				`${supplier.name} — ${t(
					next
						? localizationConstants.purchaseApiConnectedToast
						: localizationConstants.purchaseApiDisconnectedToast,
				)}`,
			);
		},
		[setConnected, t],
	);

	return (
		<div className="flex flex-col gap-6">
			<SectionCard
				title={localizationConstants.purchaseApiCategory}
				action={
					<Button
						type="button"
						onClick={() =>
							showToast(
								"info",
								t(
									localizationConstants.purchaseApiLicenseToast,
								),
							)
						}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.purchaseApiBuyLicense}
						/>
					</Button>
				}
			>
				{categories.map((category) => (
					<div
						key={category.id}
						className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3"
					>
						<span className="text-base font-medium text-slate-900">
							{category.name}
						</span>
						{category.active && (
							<span className="inline-flex shrink-0 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
								<Translate
									text={localizationConstants.activeStatus}
								/>
							</span>
						)}
					</div>
				))}
			</SectionCard>

			<SectionCard
				title={localizationConstants.purchaseApiSuppliersToConnect}
			>
				{toConnect.length === 0 ? (
					<p className="py-2 text-sm text-slate-400">
						<Translate
							text={
								localizationConstants.purchaseSupplierNoneFound
							}
						/>
					</p>
				) : (
					toConnect.map((supplier) => (
						<SupplierRow
							key={supplier.id}
							supplier={supplier}
							onToggle={(next) => handleToggle(supplier, next)}
						/>
					))
				)}
			</SectionCard>

			<SectionCard
				title={localizationConstants.purchaseApiConnectedSuppliers}
			>
				{connected.length === 0 ? (
					<p className="py-2 text-sm text-slate-400">
						<Translate
							text={
								localizationConstants.purchaseSupplierNoneFound
							}
						/>
					</p>
				) : (
					connected.map((supplier) => (
						<SupplierRow
							key={supplier.id}
							supplier={supplier}
							onToggle={(next) => handleToggle(supplier, next)}
						/>
					))
				)}
			</SectionCard>
		</div>
	);
}

export default PurchaseApiIntegrationsTab;
