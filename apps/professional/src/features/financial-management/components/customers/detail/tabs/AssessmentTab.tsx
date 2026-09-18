"use client";

import React from "react";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import { RatingsCard } from "./assessment/RatingsCard";
import { DocumentsCard } from "./assessment/DocumentsCard";
import { NotesCard } from "./assessment/NotesCard";

interface AssessmentTabProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
	onDeleteDocument?: (docId: string) => void;
}

export const AssessmentTab: React.FC<AssessmentTabProps> = ({
	customer,
	onUpdate,
	onDeleteDocument,
}) => {
	return (
		<div className="space-y-6">
			<RatingsCard customer={customer} onUpdate={onUpdate} />
			<DocumentsCard
				customer={customer}
				onUpdate={onUpdate}
				onDeleteDocument={onDeleteDocument}
			/>
			<NotesCard customer={customer} onUpdate={onUpdate} />
		</div>
	);
};
