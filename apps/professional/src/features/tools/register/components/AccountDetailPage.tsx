"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { detailIdSchema, type AccountPlanDetail } from "../types";
import { getAccountPlanDetailAPIAction } from "../api/accountPlan";
import { DetailSectionCard } from "./DetailSectionCard";

function getModeTranslationKey(mode?: string): string {
	if (mode === "allowed" || mode === "tillatet") {
		return localizationConstants.radioTillatet;
	}
	if (mode === "not_allowed" || mode === "ej_tillatet") {
		return localizationConstants.radioEjTillatet;
	}
	return localizationConstants.radioObligatoriskt;
}

export function AccountDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";
	const isValidId = detailIdSchema.safeParse(cleanId).success;

	const [account, setAccount] = useState<AccountPlanDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAccount = useCallback(async () => {
		if (!isValidId) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const data = await getAccountPlanDetailAPIAction(cleanId);
			setAccount(data);
		} finally {
			setIsLoading(false);
		}
	}, [cleanId, isValidId]);

	useEffect(() => {
		fetchAccount();
	}, [fetchAccount]);

	const handleBack = () => {
		router.push("/tools/register?tab=accountPlan&subtab=kontoplan");
	};

	const handleEdit = () => {
		if (!cleanId) return;
		router.push(`/tools/register/account-plan/${cleanId}/edit`);
	};

	if (isLoading || !account) {
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
					<div className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white" />
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
					#{account.accountNumber || cleanId}
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
						titleKey={localizationConstants.grundInformationSection}
						editAriaLabelKey={localizationConstants.editBasicInfoAriaLabel}
						onEdit={handleEdit}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{/* Kontonummer */}
							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.accountNumberHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.accountNumber || "-"}
								</span>
							</div>

							{/* Benämning */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.accountNameHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.accountName || "-"}
								</span>
							</div>

							{/* Ingående balans */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.openingBalanceLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.openingBalance || "-"}
								</span>
							</div>

							{/* Aktivt */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.activeStatusLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.status === "active" ? (
										<Translate text={localizationConstants.costCenterActiveStatus} />
									) : (
										<Translate text={localizationConstants.costCenterInactiveStatus} />
									)}
								</span>
							</div>
						</div>
					</DetailSectionCard>

					{/* Card 2: Ytterligare uppgifter */}
					<DetailSectionCard
						titleKey={localizationConstants.additionalDetailsSection}
						editAriaLabelKey={localizationConstants.editAdditionalInfoAriaLabel}
						onEdit={handleEdit}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{/* SRU-kod */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.sruLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.sru || "-"}
								</span>
							</div>

							{/* Momskod */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.vatCodeLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.vatCode || "-"}
								</span>
							</div>

							{/* Kostnadsställe */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.costCenterLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									<Translate text={getModeTranslationKey(account.costCenterMode)} />
								</span>
							</div>

							{/* Projekt */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.projectLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									<Translate text={getModeTranslationKey(account.projectMode)} />
								</span>
							</div>

							{/* Föreslå kostnadsställe */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.suggestedCostCenterLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.suggestedCostCenter || "-"}
								</span>
							</div>

							{/* Föreslå projekt */}
							<div className="flex flex-col gap-1">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.suggestedProjectLabel} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{account.suggestedProject || "-"}
								</span>
							</div>
						</div>
					</DetailSectionCard>
				</div>
			</div>
		</div>
	);
}
