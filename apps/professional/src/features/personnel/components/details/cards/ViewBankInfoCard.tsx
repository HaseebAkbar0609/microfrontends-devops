"use client";

import React from "react";
import { CreditCard, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { BankInfoForm } from "../../../types/createEmployee.types";

interface ViewBankInfoCardProps {
	data: BankInfoForm;
	onEdit: () => void;
}

export function ViewBankInfoCard({ data, onEdit }: ViewBankInfoCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
			{/* Card Header */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
						<CreditCard className="w-4 h-4" />
					</div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.sectionBankInfo} />
					</h2>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-md cursor-pointer shadow-2xs gap-1.5"
				>
					<Pencil className="w-3.5 h-3.5 text-slate-500" />
					<Translate text={localizationConstants.btnEditCard} />
				</Button>
			</div>

			{/* Card Body Key-Value Grid matching Screenshot 1 */}
			<div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldBank} />
					</span>
					<span className="font-medium text-slate-900 text-sm">
						{data.bankName || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldClearingNo} />
					</span>
					<span className="font-mono font-medium text-slate-900">
						{data.clearingNumber || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldAccountNo} />
					</span>
					<span className="font-mono font-medium text-slate-900">
						{data.accountNumber || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldSwishNo} />
					</span>
					<span className="font-mono font-medium text-slate-900">
						{data.swishNumber || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldIban} />
					</span>
					<span className="font-mono font-medium text-slate-900">
						{data.iban || "—"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-1">
						<Translate text={localizationConstants.fieldBic} />
					</span>
					<span className="font-mono font-medium text-slate-900 uppercase">
						{data.bic || "—"}
					</span>
				</div>
			</div>
		</div>
	);
}
