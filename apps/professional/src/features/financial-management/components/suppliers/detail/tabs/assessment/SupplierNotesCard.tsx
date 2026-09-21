"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import { SupplierDetailCard } from "../../cards/SupplierDetailCard";

interface SupplierNotesCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierNotesCard({ supplier, onUpdate }: SupplierNotesCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [notes, setNotes] = useState(supplier.additionalNotes || "");

	const handleSave = () => {
		onUpdate({ additionalNotes: notes });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setNotes(supplier.additionalNotes || "");
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardNotes} />}
			icon={<FileText className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<Textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					className="text-xs min-h-[100px] bg-white"
					placeholder="Skriv anteckningar..."
				/>
			) : (
				<p className="text-xs text-slate-700 whitespace-pre-wrap">
					{supplier.additionalNotes || "Inga anteckningar registrerade"}
				</p>
			)}
		</SupplierDetailCard>
	);
}
