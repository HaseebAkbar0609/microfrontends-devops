"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DEMO_TRIAL_DAYS,
	TEST_TRIAL_DAYS,
} from "../../constants/sales.constants";
import type { SalesCompany, TrialKind } from "../../types";
import { daysUntil, formatDate } from "../../utils/salesFormatters";
import { createTrialAccount } from "../../utils/salesFactories";
import { SalesSectionCard } from "../SalesSectionCard";

type TrialAccountsCardProps = {
	company: SalesCompany;
	kind: TrialKind;
	onChange: (patch: Partial<SalesCompany>) => void;
};

const COPY_BY_KIND = {
	demo: {
		titleKey: localizationConstants.salesDemoAccountsTitle,
		emptyKey: localizationConstants.salesEmptyDemoAccounts,
		days: DEMO_TRIAL_DAYS,
	},
	test: {
		titleKey: localizationConstants.salesTestAccountsTitle,
		emptyKey: localizationConstants.salesEmptyTestAccounts,
		days: TEST_TRIAL_DAYS,
	},
} as const;

export function TrialAccountsCard({
	company,
	kind,
	onChange,
}: TrialAccountsCardProps) {
	const copy = COPY_BY_KIND[kind];
	const accounts = kind === "demo" ? company.demoAccounts : company.testAccounts;
	const t = useTranslate();

	const patchAccounts = (next: SalesCompany["demoAccounts"]) =>
		onChange(kind === "demo" ? { demoAccounts: next } : { testAccounts: next });

	const handleCreate = () => {
		patchAccounts([...accounts, createTrialAccount(company, copy.days, kind)]);
		showToast("success", t(localizationConstants.salesTrialCreatedToast));
	};

	const handleRemove = (index: number) => {
		patchAccounts(accounts.filter((_, position) => position !== index));
		showToast("success", t(localizationConstants.salesTrialRemovedToast));
	};

	return (
		<SalesSectionCard
			titleKey={copy.titleKey}
			action={
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="cursor-pointer gap-1.5"
					onClick={handleCreate}
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.salesNewTrialButton} />
				</Button>
			}
		>
			{accounts.length === 0 ? (
				<p className="text-sm text-slate-500">
					<Translate text={copy.emptyKey} />
				</p>
			) : (
				<div className="space-y-3">
					{accounts.map((account, index) => {
						const daysLeft = daysUntil(account.expiresAt);
						return (
							<div
								key={account.username}
								className="rounded-lg border border-slate-200 p-3 text-sm"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0">
										<p className="truncate font-medium text-slate-900">
											{account.username}
										</p>
										<p className="truncate text-xs text-slate-500">
											{account.url}
										</p>
									</div>
									<ConfirmDialog
										title={t(
											localizationConstants.salesConfirmRemoveTrialTitle,
										)}
										description={t(
											localizationConstants.salesConfirmRemoveTrialDescription,
										)}
										confirmText={t(localizationConstants.salesConfirmLabel)}
										cancelText={t(localizationConstants.salesCancelButton)}
										onConfirm={() => handleRemove(index)}
										trigger={
											<Button
												type="button"
												size="icon"
												variant="ghost"
												aria-label={t(
													localizationConstants.salesRemoveTrialLabel,
												)}
												className="h-7 w-7 shrink-0 cursor-pointer"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										}
									/>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
									<span>
										{formatDate(account.startedAt)} →{" "}
										{formatDate(account.expiresAt)}
									</span>
									<span
										className={
											daysLeft > 0 ? "text-emerald-700" : "text-red-600"
										}
									>
										{daysLeft > 0 ? (
											<>
												{daysLeft}{" "}
												<Translate
													text={
														daysLeft === 1
															? localizationConstants.salesTrialDayLeftSuffix
															: localizationConstants.salesTrialDaysLeftSuffix
													}
												/>
											</>
										) : (
											<Translate
												text={localizationConstants.salesTrialExpired}
											/>
										)}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</SalesSectionCard>
	);
}
