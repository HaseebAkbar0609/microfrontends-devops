"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { CompetenceDocItem } from "@/features/personnel/types/createEmployee.types";
import { AddCompetenceModal } from "../modals/AddCompetenceModal";
import { CompetenceUploadCard } from "./step4/CompetenceUploadCard";
import { CompetenceTableCard } from "./step4/CompetenceTableCard";

interface Step4KompetensProps {
	uploadedTags: string[];
	competenceDocs: CompetenceDocItem[];
	onRemoveTag: (tag: string) => void;
	onAddDoc: (doc: Omit<CompetenceDocItem, "id">) => void;
	onRemoveDoc: (id: string) => void;
}

export function Step4Kompetens({
	uploadedTags,
	competenceDocs,
	onRemoveTag,
	onAddDoc,
	onRemoveDoc,
}: Step4KompetensProps) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="space-y-6">
			{/* Top Action Button */}
			<div className="flex items-center justify-start">
				<Button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					{t(localizationConstants.addCompetenceBtn)}
				</Button>
			</div>

			{/* Upload Box */}
			<CompetenceUploadCard
				uploadedTags={uploadedTags}
				onRemoveTag={onRemoveTag}
				onAddDoc={onAddDoc}
			/>

			{/* Competence Table */}
			<CompetenceTableCard
				competenceDocs={competenceDocs}
				onRemoveDoc={onRemoveDoc}
			/>

			{/* Modal */}
			<AddCompetenceModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={onAddDoc}
			/>
		</div>
	);
}
