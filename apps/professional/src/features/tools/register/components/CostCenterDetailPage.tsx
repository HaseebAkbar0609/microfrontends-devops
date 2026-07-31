"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UserPlus, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CostCenterDetail } from "../types";
import { getCostCenterDetailAPIAction } from "../api/costCenterRegister";

interface DetailSectionCardProps {
	titleKey: string;
	editAriaLabelKey: string;
	onEdit: () => void;
	children: React.ReactNode;
}

function DetailSectionCard({
	titleKey,
	editAriaLabelKey,
	onEdit,
	children,
}: DetailSectionCardProps) {
	const t = useTranslate();
	return (
		<Card className="w-full border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
			<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<UserPlus className="h-5 w-5 text-slate-700" aria-hidden />
					<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
						<Translate text={titleKey} />
					</h2>
				</div>

				<button
					type="button"
					onClick={onEdit}
					aria-label={t(editAriaLabelKey)}
					className="pointer-events-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm transition-colors"
				>
					<PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" aria-hidden />
					<Translate text={localizationConstants.editLabel} />
				</button>
			</div>

			<CardContent className="px-6 py-3 bg-white">{children}</CardContent>
		</Card>
	);
}

export function CostCenterDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";
	const isValidId = Boolean(cleanId && /^[a-zA-Z0-9_-]+$/.test(cleanId));

	const [costCenter, setCostCenter] = useState<CostCenterDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchCostCenter = useCallback(async () => {
		if (!isValidId) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const data = await getCostCenterDetailAPIAction(cleanId);
			setCostCenter(data);
		} finally {
			setIsLoading(false);
		}
	}, [cleanId, isValidId]);

	useEffect(() => {
		fetchCostCenter();
	}, [fetchCostCenter]);

	const handleBack = () => {
		router.push("/tools/register?tab=costCenter");
	};

	const handleEdit = () => {
		if (!cleanId) return;
		router.push(`/tools/register/cost-centre/edit/${cleanId}`);
	};

	if (isLoading || !costCenter) {
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
						aria-label={t(localizationConstants.goBackToCostCenterListLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
				</div>

				{/* Cost Center Code Subtitle */}
				<p className="mb-4 ml-8 text-sm text-slate-500">
					#{costCenter.kod || cleanId}
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
						editAriaLabelKey={localizationConstants.editCostCenterBasicInfoAriaLabel}
						onEdit={handleEdit}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{/* KOD */}
							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900 uppercase">
									<Translate text={localizationConstants.costCenterCodeHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{costCenter.kod || "-"}
								</span>
							</div>

							{/* Benämning */}
							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.costCenterNameHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{costCenter.benamning || "-"}
								</span>
							</div>

							{/* Anteckningar */}
							<div className="flex flex-col gap-0.5">
								<span className="font-sans text-sm font-medium leading-5 text-slate-900">
									<Translate text={localizationConstants.costCenterNotesHeader} />
								</span>
								<span className="font-sans text-sm font-normal leading-5 text-slate-500">
									{costCenter.anteckningar || "-"}
								</span>
							</div>
						</div>
					</DetailSectionCard>
				</div>
			</div>
		</div>
	);
}
