"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import { CustomerDetailCard } from "../../cards/CustomerDetailCard";

interface NotesCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const NotesCard: React.FC<NotesCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(customer.notes || "");

	const handleEdit = () => {
		setDraft(customer.notes || "");
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		onUpdate({ notes: draft });
		setIsEditing(false);
	};

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardAdditionalInfo} />}
			icon={<FileText className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<textarea
					rows={4}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="Skriv ytterligare information eller anteckningar här..."
					className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
				/>
			) : customer.notes ? (
				<p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
					{customer.notes}
				</p>
			) : (
				<p className="italic text-slate-400 dark:text-slate-500 text-xs">
					<Translate text={localizationConstants.customerDetailNotesEmpty} />
				</p>
			)}
		</CustomerDetailCard>
	);
};
