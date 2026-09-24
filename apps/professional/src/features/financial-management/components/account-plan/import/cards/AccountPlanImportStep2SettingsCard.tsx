"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ImportAccountSettings } from "@/features/financial-management/types/accountPlan.types";

interface AccountPlanImportStep2SettingsCardProps {
	readonly settings: ImportAccountSettings;
	readonly onUpdateSettings: <K extends keyof ImportAccountSettings>(
		key: K,
		value: ImportAccountSettings[K],
	) => void;
}

export function AccountPlanImportStep2SettingsCard({
	settings,
	onUpdateSettings,
}: AccountPlanImportStep2SettingsCardProps) {
	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6">
			<h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.importSettingsSection} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* 1. Importera endast använda */}
				<div className="flex flex-col gap-3">
					<label className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.importOnlyUsedAccounts} />
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="importeraEndastAnvanda"
								checked={settings.importeraEndastAnvanda === "alla"}
								onChange={() =>
									onUpdateSettings("importeraEndastAnvanda", "alla")
								}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.allAccountsOption} />
						</label>
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="importeraEndastAnvanda"
								checked={settings.importeraEndastAnvanda === "endast_anvanda"}
								onChange={() =>
									onUpdateSettings("importeraEndastAnvanda", "endast_anvanda")
								}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.onlyUsedOption} />
						</label>
					</div>
				</div>

				{/* 2. Använd benämning från */}
				<div className="flex flex-col gap-3">
					<label className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.useNameFrom} />
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="anvandBenamningFran"
								checked={settings.anvandBenamningFran === "sie_fil"}
								onChange={() =>
									onUpdateSettings("anvandBenamningFran", "sie_fil")
								}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.sieFileOption} />
						</label>
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="anvandBenamningFran"
								checked={
									settings.anvandBenamningFran === "befintlig_kontoplan"
								}
								onChange={() =>
									onUpdateSettings("anvandBenamningFran", "befintlig_kontoplan")
								}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.existingAccountPlanOption} />
						</label>
					</div>
				</div>

				{/* 3. Använd SRU från */}
				<div className="flex flex-col gap-3">
					<label className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.useSruFrom} />
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="anvandSruFran"
								checked={settings.anvandSruFran === "sie_fil"}
								onChange={() => onUpdateSettings("anvandSruFran", "sie_fil")}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.sieFileOption} />
						</label>
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="radio"
								name="anvandSruFran"
								checked={settings.anvandSruFran === "befintlig_kontoplan"}
								onChange={() =>
									onUpdateSettings("anvandSruFran", "befintlig_kontoplan")
								}
								className="h-4 w-4 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.existingAccountPlanOption} />
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
