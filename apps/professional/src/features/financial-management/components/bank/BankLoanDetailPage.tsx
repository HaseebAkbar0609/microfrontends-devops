"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { BANK_BASE_ROUTE } from "../../constants/bank.constants";
import type { BankLoanItem, BankDetailTabType } from "../../types/bank.types";
import { BankLoanInfoCard } from "./BankLoanInfoCard";
import { BankContactPersonCard } from "./BankContactPersonCard";
import { BankLoanDocumentsCard } from "./BankLoanDocumentsCard";

export interface BankLoanDetailPageProps {
	loan: BankLoanItem;
	onBack?: () => void;
	onEditLoan?: (loan: BankLoanItem) => void;
	onEditContact?: () => void;
	onEditDocuments?: () => void;
	onAddDocument?: () => void;
	onDeleteDocument?: (docId: string, title: string) => void;
}

export function BankLoanDetailPage({
	loan,
	onBack,
	onEditLoan,
	onEditContact,
	onEditDocuments,
	onAddDocument,
	_onDeleteDocument,
}: BankLoanDetailPageProps & { _onDeleteDocument?: (docId: string, title: string) => void }) {
	const router = useRouter();
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<BankDetailTabType>("grundlaggande-info");

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push(BANK_BASE_ROUTE);
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Header with Back Arrow + #ID */}
			<div className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleBack}
						className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
						aria-label={t(localizationConstants.btnBackToList)}
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900">
							<Translate text={localizationConstants.titleLoanDetails} />
						</h1>
						<p className="text-xs text-slate-500 font-mono">
							{loan.loanNr || `#${loan.id}`}
						</p>
					</div>
				</div>

				{/* Sub-tabs: Grundläggande info & Dokument */}
				<div className="flex gap-6 mt-4 -mb-4">
					<button
						type="button"
						onClick={() => setActiveTab("grundlaggande-info")}
						className={`pb-3 font-semibold text-sm transition-colors cursor-pointer ${
							activeTab === "grundlaggande-info"
								? "border-b-2 border-slate-900 text-slate-900"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.tabGrundlaggandeInfo} />
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("dokument")}
						className={`pb-3 font-semibold text-sm transition-colors cursor-pointer ${
							activeTab === "dokument"
								? "border-b-2 border-slate-900 text-slate-900"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.tabDokument} />
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6 max-w-6xl mx-auto w-full space-y-6">
				{activeTab === "grundlaggande-info" ? (
					<>
						{/* Card 1: Loan financial specs */}
						<BankLoanInfoCard loan={loan} onEdit={onEditLoan || (() => {})} />

						{/* Card 2: Contact Person */}
						<BankContactPersonCard
							contactPerson={loan.contactPerson}
							onEdit={onEditContact || (() => {})}
						/>
					</>
				) : (
					/* Tab 2: Documents */
					<BankLoanDocumentsCard
						documents={loan.documents}
						onEdit={onAddDocument || onEditDocuments || (() => {})}
					/>
				)}
			</div>
		</div>
	);
}
