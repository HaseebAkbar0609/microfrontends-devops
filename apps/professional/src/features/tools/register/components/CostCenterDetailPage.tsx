"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { detailIdSchema } from "../types";
import { getCostCenterDetailAPIAction } from "../api/costCenterRegister";
import { DetailSectionCard } from "./DetailSectionCard";

export function CostCenterDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";
	const isValidId = detailIdSchema.safeParse(cleanId).success;

	const { data: costCenter, isLoading } = useQuery({
		queryKey: ["costCenterDetail", cleanId],
		queryFn: () => getCostCenterDetailAPIAction(cleanId),
		enabled: isValidId,
	});

	const handleBack = () => {
		router.push("/tools/register/cost-centre");
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
