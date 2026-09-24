"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAccountPlanImport } from "@/features/financial-management/hooks/useAccountPlanImport";
import { AccountPlanImportStep1DropCard } from "./cards/AccountPlanImportStep1DropCard";
import { AccountPlanImportStep2SettingsCard } from "./cards/AccountPlanImportStep2SettingsCard";
import { AccountPlanImportStep2MappingTableCard } from "./cards/AccountPlanImportStep2MappingTableCard";

export function AccountPlanImportPage() {
	const {
		step,
		settings,
		mappingRows,
		isSubmitting,
		handleFileSelect,
		updateSettings,
		updateMappingRow,
		handleExecuteImport,
		handleCancel,
		handleBackToStep1,
	} = useAccountPlanImport();

	return (
		<div className="w-full flex flex-col gap-6 py-4 pb-20">
			{/* Page Header */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={step === 2 ? handleBackToStep1 : handleCancel}
					className="p-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
					aria-label="Back"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.importFileTitle} />
				</h1>
			</div>

			{/* Main Content Area */}
			{step === 1 ? (
				<AccountPlanImportStep1DropCard onFileSelect={handleFileSelect} />
			) : (
				<div className="flex flex-col gap-6">
					<AccountPlanImportStep2SettingsCard
						settings={settings}
						onUpdateSettings={updateSettings}
					/>

					<AccountPlanImportStep2MappingTableCard
						rows={mappingRows}
						onUpdateRow={updateMappingRow}
					/>

					{/* Sticky Bottom Actions Bar */}
					<div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur-md px-6 py-3.5 z-20 flex justify-end items-center gap-3 shadow-lg">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							className="h-10 px-6 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							disabled={isSubmitting}
							onClick={handleExecuteImport}
							className="h-10 px-6 gap-2 rounded-lg bg-[#111721] text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
						>
							<Translate text={localizationConstants.importButtonText} />
							<Save className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
