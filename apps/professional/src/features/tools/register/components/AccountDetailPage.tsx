"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UserPlus, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AccountPlanDetail } from "../types";
import { getAccountPlanDetailAPIAction } from "../api/accountPlan";

export function AccountDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [account, setAccount] = useState<AccountPlanDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAccount = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getAccountPlanDetailAPIAction(id);
			setAccount(data);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchAccount();
	}, [fetchAccount]);

	const handleBack = () => {
		router.push("/tools/register?tab=accountPlan&subtab=kontoplan");
	};

	const handleEdit = () => {
		router.push(`/tools/register/account-plan/${id}/edit`);
	};

	if (isLoading || !account) {
		return (
			<div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-4">
				<div className="flex items-center gap-2 mb-4">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 ml-8 mb-6" />
				<div className="pl-6 space-y-6">
					<div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white" />
					<div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white" />
				</div>
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
						aria-label={t(localizationConstants.goBackToAccountPlanLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
				</div>

				{/* Account Number Subtitle */}
				<p className="mb-4 ml-8 text-sm text-slate-500">
					#{account.accountNumber || id}
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
					<Card className="w-full border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
						<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<UserPlus className="h-5 w-5 text-slate-700" aria-hidden />
								<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
									<Translate text={localizationConstants.grundInformationSection} />
								</h2>
							</div>

							<button
								type="button"
								onClick={handleEdit}
								className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors"
							>
								<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" aria-hidden />
								<Translate text={localizationConstants.editLabel} />
							</button>
						</div>

						<CardContent className="p-6 bg-white">
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
								{/* Kontonummer */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.accountNumberHeader} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.accountNumber || "-"}
									</span>
								</div>

								{/* Benämning */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.accountNameHeader} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.accountName || "-"}
									</span>
								</div>

								{/* Ingående balans */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.openingBalanceLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.openingBalance || "0,00 kr"}
									</span>
								</div>

								{/* Aktivt */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.activeStatusLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.status === "active" ? (
											<Translate text={localizationConstants.costCenterActiveStatus} />
										) : (
											<Translate text={localizationConstants.costCenterInactiveStatus} />
										)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Card 2: Ytterligare uppgifter */}
					<Card className="w-full border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
						<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<UserPlus className="h-5 w-5 text-slate-700" aria-hidden />
								<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
									<Translate text={localizationConstants.additionalDetailsSection} />
								</h2>
							</div>

							<button
								type="button"
								onClick={handleEdit}
								className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors"
							>
								<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" aria-hidden />
								<Translate text={localizationConstants.editLabel} />
							</button>
						</div>

						<CardContent className="p-6 bg-white">
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6">
								{/* SRU-kod */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.sruLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.sru || "102"}
									</span>
								</div>

								{/* Momskod */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.vatCodeLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.vatCode || "25%"}
									</span>
								</div>

								{/* Kostnadsställe */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.costCenterLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										<Translate text={localizationConstants.radioObligatoriskt} />
									</span>
								</div>

								{/* Projekt */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.projectLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										<Translate text={localizationConstants.radioObligatoriskt} />
									</span>
								</div>

								{/* Föreslå kostnadsställe */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.suggestedCostCenterLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.suggestedCostCenter || "Kontor 10"}
									</span>
								</div>

								{/* Föreslå projekt */}
								<div className="flex flex-col gap-1">
									<span className="text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.suggestedProjectLabel} />
									</span>
									<span className="text-sm text-slate-900 font-normal">
										{account.suggestedProject || "Projekt 100"}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
