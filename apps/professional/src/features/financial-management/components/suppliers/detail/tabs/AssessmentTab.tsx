"use client";

import React from "react";
import type { SupplierDetailData } from "../../../../types/supplierDetail.types";
import type { SupplierAttachedDocument } from "../../../../types/createSupplier.types";
import { SupplierAssessmentCard } from "./assessment/SupplierAssessmentCard";
import { SupplierDocumentsCard } from "./assessment/SupplierDocumentsCard";
import { SupplierNotesCard } from "./assessment/SupplierNotesCard";

interface AssessmentTabProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
	onAddDocument: (doc: SupplierAttachedDocument) => void;
	onDeleteDocument: (id: string) => void;
}

export function AssessmentTab({
	supplier,
	onUpdate,
	onAddDocument,
	onDeleteDocument,
}: AssessmentTabProps) {
	return (
		<div className="space-y-6">
			<SupplierAssessmentCard supplier={supplier} onUpdate={onUpdate} />
			<SupplierDocumentsCard
				documents={supplier.documents}
				onAddDocument={onAddDocument}
				onDeleteDocument={onDeleteDocument}
			/>
			<SupplierNotesCard supplier={supplier} onUpdate={onUpdate} />
		</div>
	);
}
