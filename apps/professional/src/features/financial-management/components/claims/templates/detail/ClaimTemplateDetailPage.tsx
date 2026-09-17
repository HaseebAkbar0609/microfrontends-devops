"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { claimsRepository } from "@/features/financial-management/utils/claimsRepository";
import {
	CLAIMS_BASE_ROUTE,
	CREATE_CLAIM_TEMPLATE_ROUTE,
} from "@/features/financial-management/constants/claims.constants";

interface ClaimTemplateDetailPageProps {
	templateId: string;
}

export function ClaimTemplateDetailPage({
	templateId,
}: ClaimTemplateDetailPageProps) {
	const router = useRouter();
	const template = claimsRepository.getTemplateById(templateId);

	const handleBack = () => {
		router.push(`${CLAIMS_BASE_ROUTE}?tab=mallar`);
	};

	const handleEdit = () => {
		if (!template) return;
		router.push(`${CREATE_CLAIM_TEMPLATE_ROUTE}?id=${encodeURIComponent(template.id)}`);
	};

	if (!template) {
		return (
			<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen p-8">
				<div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-sm text-slate-500 shadow-2xs">
					<Translate text={localizationConstants.claimTplNoTemplatesFound} />
					<div className="mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleBack}
							className="h-9 text-xs cursor-pointer"
						>
							<Translate text={localizationConstants.btnBackToOverviewYearEnd || "Tillbaka"} />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen">
			{/* Top Header */}
			<div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0">
				<div className="flex items-start gap-3 mb-4">
					<button
						type="button"
						onClick={handleBack}
						className="p-1 mt-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
						title="Tillbaka"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900">
							<Translate text={localizationConstants.claimTplDetaljer} />
						</h1>
						<p className="text-xs font-medium text-slate-500 mt-0.5">
							{template.id}
						</p>
					</div>
				</div>

				{/* Sub-tab: Mall */}
				<div className="flex items-center gap-8">
					<button
						type="button"
						className="pb-3 text-sm font-semibold text-slate-900 border-b-2 border-slate-900 transition-all cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplTabMall} />
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="p-8 max-w-5xl w-full flex-1">
				<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 space-y-6">
					{/* Card Header with UserPlus icon + Grunduppgifter and Edit button */}
					<div className="flex items-center justify-between border-b border-slate-100 pb-4">
						<div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
							<UserPlus className="w-4 h-4 text-slate-700" />
							<span>
								<Translate text={localizationConstants.claimTplTabGrunduppgifter} />
							</span>
						</div>

						<Button
							type="button"
							variant="outline"
							onClick={handleEdit}
							className="h-8 px-3 text-xs text-slate-700 hover:bg-slate-50 border-slate-200 rounded-md flex items-center gap-1.5 cursor-pointer"
						>
							<Pencil className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.claimTplBtnEdit} />
						</Button>
					</div>

					{/* Fields Grid */}
					<div className="space-y-6">
						{/* 3-column row: ID, Datum, Title */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<div className="text-xs font-medium text-slate-700 mb-1">
									<Translate text={localizationConstants.claimTplFieldId} />
								</div>
								<div className="text-sm text-slate-500">
									{template.id}
								</div>
							</div>

							<div>
								<div className="text-xs font-medium text-slate-700 mb-1">
									<Translate text={localizationConstants.claimTplFieldDatum} />
								</div>
								<div className="text-sm text-slate-500">
									{template.date}
								</div>
							</div>

							<div>
								<div className="text-xs font-medium text-slate-700 mb-1">
									<Translate text={localizationConstants.claimTplFieldTitle} />
								</div>
								<div className="text-sm text-slate-500">
									{template.title}
								</div>
							</div>
						</div>

						{/* Full-width row: Beskrivning */}
						<div>
							<div className="text-xs font-medium text-slate-700 mb-1">
								<Translate text={localizationConstants.claimTplFieldBeskrivning} />
							</div>
							<div className="text-sm text-slate-500 leading-relaxed">
								{template.description || "—"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClaimTemplateDetailPage;
