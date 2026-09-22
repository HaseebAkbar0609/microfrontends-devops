"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ArticleImportActionsBarProps {
	readonly hasFile: boolean;
	readonly isImporting: boolean;
	readonly onImport: () => void;
	readonly onCancel: () => void;
}

export function ArticleImportActionsBar({
	hasFile,
	isImporting,
	onImport,
	onCancel,
}: ArticleImportActionsBarProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
			>
				<Translate text={localizationConstants.cancelButton} />
			</Button>

			<Button
				type="button"
				onClick={onImport}
				disabled={!hasFile || isImporting}
				className="bg-[#111721] hover:bg-slate-800 text-white cursor-pointer px-6"
			>
				{isImporting ? (
					<Translate text={localizationConstants.importingLabel} />
				) : (
					<Translate text={localizationConstants.importArticles} />
				)}
			</Button>
		</div>
	);
}
