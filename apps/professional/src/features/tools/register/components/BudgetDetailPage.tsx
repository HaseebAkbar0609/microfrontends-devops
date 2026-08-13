"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { detailIdSchema } from "../types";
import { getBudgetDetailAPIAction } from "../api/budgetRegister";
import { DetailSectionCard } from "./DetailSectionCard";

const formatAmount = (value: number | undefined | null, currency = "SEK") => {
	if (value === undefined || value === null || Number.isNaN(Number(value))) {
		return "-";
	}
	// Validate currency as three-letter ISO 4217 code (fallback to SEK)
	let curr = typeof currency === "string" ? currency.toUpperCase() : "SEK";
	if (!/^[A-Z]{3}$/.test(curr)) curr = "SEK";
	return new Intl.NumberFormat("sv-SE", {
		style: "currency",
		currency: curr,
	}).format(Number(value));
};

export function BudgetDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";
	const isValidId = detailIdSchema.safeParse(cleanId).success;

	const { data: budget, isLoading, isError } = useQuery({
		queryKey: ["budgetDetail", cleanId],
		queryFn: () => getBudgetDetailAPIAction(cleanId),
		enabled: isValidId,
	});

	const handleBack = () => {
		router.push("/tools/register/budget");
	};

	if (isLoading) {
		return (
			<div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-16 animate-pulse rounded bg-slate-200 opacity-60 ml-8 mb-6" />
				<div className="h-9 w-40 animate-pulse rounded-md bg-slate-200 ml-8 mb-6" />
				<div className="pl-6 space-y-6">
					<div className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
				<h2 className="text-lg font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.budgetFetchError} />
				</h2>
				<button
					type="button"
					onClick={handleBack}
					className="px-4 py-2 text-sm font-medium text-white bg-[#111721] rounded-md hover:bg-slate-800 cursor-pointer"
				>
					<Translate text={localizationConstants.goBackButton} />
				</button>
			</div>
		);
	}

	if (!isValidId || !budget) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
				<h2 className="text-lg font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.notFoundTitle} />
				</h2>
				<p className="text-sm text-slate-500 mb-4">
					<Translate text={localizationConstants.notFoundDescription} />
				</p>
				<button
					type="button"
					onClick={handleBack}
					className="px-4 py-2 text-sm font-medium text-white bg-[#111721] rounded-md hover:bg-slate-800 cursor-pointer"
				>
					<Translate text={localizationConstants.goBackButton} />
				</button>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			{/* Main Content Area */}
			<div className="flex-1 gap-2 p-4">
				{/* Top Header with Back Arrow */}
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						onClick={handleBack}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
						aria-label={t(localizationConstants.goBackToBudgetListLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
				</div>

				{/* Budget Number Subtitle */}
				<p className="mb-4 ml-8 text-sm text-slate-500">
					#{budget.budgetnr || cleanId}
				</p>

				{/* Sub-tab Header Line */}
				<div className="flex gap-4 ml-8 overflow-x-auto border-b border-slate-200 mb-6 sm:gap-6">
					<button
						type="button"
						className="whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 border-slate-900 text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.grundlaggandeInfoTab} />
					</button>
				</div>

				{/* Main Information Cards Container */}
				<div className="pl-6 flex flex-col items-start gap-6">
					{/* Card 1: Grund information */}
					<DetailSectionCard
						titleKey={localizationConstants.budgetInformationSection}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900 uppercase">
									<Translate text={localizationConstants.budgetNrHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.budgetnr || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetNameHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.name || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetAmountLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{formatAmount(budget.totalAmount, budget.currency ?? "SEK")}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetCurrencyLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.currency || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetCategoryLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.category || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetStartDateLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.startDate || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.budgetEndDateLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.endDate || "-"}
								</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.descriptionLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{budget.description || "-"}
								</span>
							</div>
						</div>
					</DetailSectionCard>

					{/* Card 2: Budget vs actual */}
					{budget.budgetVsActual && (
						<DetailSectionCard
							titleKey={localizationConstants.budgetVsActualSection}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="flex flex-col gap-0.5">
									<span className="font-sans text-sm font-medium leading-5 text-slate-900">
										<Translate text={localizationConstants.budgetAmountLabel} />
									</span>
									<span className="font-sans text-sm font-normal leading-5 text-slate-500">
										{formatAmount(budget.budgetVsActual.budget_amount, budget.currency ?? "SEK")}
									</span>
								</div>
								<div className="flex flex-col gap-0.5">
									<span className="font-sans text-sm font-medium leading-5 text-slate-900">
										<Translate text={localizationConstants.budgetActualSpendLabel} />
									</span>
									<span className="font-sans text-sm font-normal leading-5 text-slate-500">
										{formatAmount(budget.budgetVsActual.actual_spend, budget.currency ?? "SEK")}
									</span>
								</div>
								<div className="flex flex-col gap-0.5">
									<span className="font-sans text-sm font-medium leading-5 text-slate-900">
										<Translate text={localizationConstants.budgetDifferenceLabel} />
									</span>
									<span className="font-sans text-sm font-normal leading-5 text-slate-500">
										{formatAmount(budget.budgetVsActual.difference, budget.currency ?? "SEK")}
									</span>
								</div>
								<div className="flex flex-col gap-0.5">
									<span className="font-sans text-sm font-medium leading-5 text-slate-900">
										<Translate text={localizationConstants.budgetPercentUsedLabel} />
									</span>
									<span className="font-sans text-sm font-normal leading-5 text-slate-500">
										{typeof budget.budgetVsActual.percent_used === "number"
											? `${budget.budgetVsActual.percent_used.toLocaleString("sv-SE")}%`
											: "-"}
									</span>
								</div>
							</div>
						</DetailSectionCard>
					)}

					{/* Card 3: Expense breakdown by category */}
					{budget.expenseBreakdown && budget.expenseBreakdown.length > 0 && (
						<DetailSectionCard
							titleKey={localizationConstants.expenseBreakdownSection}
						>
							<div className="flex flex-col gap-2">
								{budget.expenseBreakdown.map((entry) => (
									<div
										key={entry.category}
										className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
									>
										<span className="font-sans text-sm font-medium leading-5 text-slate-900">
											{entry.category}
										</span>
										<span className="font-sans text-sm font-normal leading-5 text-slate-500">
											<Translate text={localizationConstants.budgetAmountLabel} />{" "}
											{formatAmount(entry.budgeted, budget.currency ?? "SEK")}
										</span>
										<span className="font-sans text-sm font-normal leading-5 text-slate-500">
											<Translate text={localizationConstants.budgetActualSpendLabel} />{" "}
											{formatAmount(entry.actual, budget.currency ?? "SEK")}
										</span>
									</div>
								))}
							</div>
						</DetailSectionCard>
					)}
				</div>
			</div>
		</div>
	);
}