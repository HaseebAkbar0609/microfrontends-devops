"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface CreateClaimHeaderProps {
	isEditMode: boolean;
	activeTab: "basic" | "docs";
	onTabChange: (tab: "basic" | "docs") => void;
	onCancel: () => void;
}

export function CreateClaimHeader({
	isEditMode,
	activeTab,
	onTabChange,
	onCancel,
}: CreateClaimHeaderProps) {
	return (
		<div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0">
			<div className="flex items-center gap-3 mb-4">
				<button
					type="button"
					onClick={onCancel}
					className="p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
				>
					<ArrowLeft className="w-5 h-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					{isEditMode ? (
						<Translate text={localizationConstants.claimsTitleEdit} />
					) : (
						<Translate text={localizationConstants.claimsTitleCreate} />
					)}
				</h1>
			</div>

			{/* Tabs: Grunduppgifter / Dokuments matching Figma Screenshots 2 & 3 */}
			<div className="flex items-center gap-6">
				<button
					type="button"
					onClick={() => onTabChange("basic")}
					className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
						activeTab === "basic"
							? "text-slate-900 border-b-2 border-slate-900"
							: "text-slate-500 hover:text-slate-700"
					}`}
				>
					<Translate text={localizationConstants.claimsTabBasic} />
				</button>
				<button
					type="button"
					onClick={() => onTabChange("docs")}
					className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
						activeTab === "docs"
							? "text-slate-900 border-b-2 border-slate-900"
							: "text-slate-500 hover:text-slate-700"
					}`}
				>
					<Translate text={localizationConstants.claimsTitleTabDokuments} />
				</button>
			</div>
		</div>
	);
}

export default CreateClaimHeader;
