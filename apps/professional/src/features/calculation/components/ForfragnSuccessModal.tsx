"use client";

import React from "react";
import { CheckCircle2, FileText, User, Building, ArrowRight } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ForfragnSuccessModalProps {
	isOpen: boolean;
	projectName: string;
	customerName?: string;
	documentsCount: number;
	suppliersCount: number;
	onViewEnquiry: () => void;
	onReturnDashboard: () => void;
}

export function ForfragnSuccessModal({
	isOpen,
	projectName,
	customerName,
	documentsCount,
	suppliersCount,
	onViewEnquiry,
	onReturnDashboard,
}: ForfragnSuccessModalProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl [&>button]:hidden">
				<DialogHeader className="flex flex-col items-center text-center">
					<div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
						<CheckCircle2 className="h-8 w-8" />
					</div>
					<DialogTitle className="text-xl font-bold text-slate-900">
						<Translate text={localizationConstants.calcInquiryWizSuccessTitle} />
					</DialogTitle>
					<p className="mt-1 text-sm text-slate-500">
						<Translate text={localizationConstants.calcInquiryWizSuccessDesc} />
					</p>
				</DialogHeader>

				<div className="my-4 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs sm:text-sm">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-slate-500 font-medium">
							<Building className="h-4 w-4 text-slate-400" />
							<Translate text={localizationConstants.projectName} />:
						</span>
						<span className="font-semibold text-slate-900 truncate max-w-[200px]">
							{projectName || "Ny Förfrågan"}
						</span>
					</div>

					{customerName && (
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-1.5 text-slate-500 font-medium">
								<User className="h-4 w-4 text-slate-400" />
								<Translate text={localizationConstants.calcNewKontaktperson} />:
							</span>
							<span className="font-semibold text-slate-900">{customerName}</span>
						</div>
					)}

					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-slate-500 font-medium">
							<FileText className="h-4 w-4 text-slate-400" />
							<Translate text={localizationConstants.calcInquiryWizBifogadeDokument} />:
						</span>
						<span className="font-semibold text-slate-900">{documentsCount} st</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-slate-500 font-medium">
							<Translate text={localizationConstants.calcInquiryWizInbjudnaLeverantorer} />:
						</span>
						<span className="font-semibold text-slate-900">{suppliersCount} st</span>
					</div>
				</div>

				<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={onReturnDashboard}
						className="h-10 w-full sm:w-auto cursor-pointer border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.calcInquiryWizReturnDashboardBtn} />
					</Button>
					<Button
						type="button"
						onClick={onViewEnquiry}
						className="h-10 w-full sm:w-auto cursor-pointer gap-2 bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.calcInquiryWizViewEnquiryBtn} />
						<ArrowRight className="h-4 w-4" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
