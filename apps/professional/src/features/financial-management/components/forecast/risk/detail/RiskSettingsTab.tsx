"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { RiskClient, RiskClientSettings } from "../../../../types/forecastRisk.types";
import { RiskThresholdField } from "./RiskThresholdField";

export interface RiskSettingsTabProps {
	client: RiskClient;
	settings: RiskClientSettings;
	onChange: <K extends keyof RiskClientSettings>(key: K, value: RiskClientSettings[K]) => void;
	onSave: () => void;
}

/** What counts as too much for this client, and when to say so. */
export function RiskSettingsTab({ client, settings, onChange, onSave }: RiskSettingsTabProps) {
	const t = useTranslate();

	return (
		<form
			className="flex max-w-xl flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs"
			onSubmit={(event) => {
				event.preventDefault();
				onSave();
			}}
		>
			<div className="flex flex-col gap-1">
				<h3 className="text-lg font-bold text-slate-900">
					<Translate text={localizationConstants.forecastRiskSettingsTitle} />
				</h3>
				<p className="text-sm text-slate-500">
					{t(localizationConstants.forecastRiskSettingsSubtitle, { client: client.name })}
				</p>
			</div>

			<RiskThresholdField
				id="risk-spending-threshold"
				labelKey={localizationConstants.forecastRiskThresholdLabel}
				helpKey={localizationConstants.forecastRiskThresholdHelp}
				unitKey={localizationConstants.forecastRiskUnitSek}
				value={settings.spendingThreshold}
				onChange={(value) => onChange("spendingThreshold", value)}
			/>

			<RiskThresholdField
				id="risk-credit-limit"
				labelKey={localizationConstants.forecastRiskCreditLabel}
				helpKey={localizationConstants.forecastRiskCreditHelp}
				unitKey={localizationConstants.forecastRiskUnitSek}
				value={settings.creditLimit}
				onChange={(value) => onChange("creditLimit", value)}
			/>

			<div className="flex flex-col gap-2">
				<RiskThresholdField
					id="risk-alert-percent"
					labelKey={localizationConstants.forecastRiskAlertLabel}
					helpKey={localizationConstants.forecastRiskAlertHelp}
					unitKey={localizationConstants.forecastRiskUnitPercent}
					value={settings.alertPercent}
					onChange={(value) => onChange("alertPercent", Math.min(Math.max(value, 0), 100))}
					max={100}
				/>
				{/* The bar reads the field back, so the share is visible as it is typed. */}
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden>
					<div
						className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
						style={{ width: `${Math.min(Math.max(settings.alertPercent, 0), 100)}%` }}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
				<div className="flex min-w-0 flex-col gap-0.5">
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastRiskAutoRedTitle} />
					</span>
					<span className="text-xs text-slate-500">
						<Translate text={localizationConstants.forecastRiskAutoRedBody} />
					</span>
				</div>
				<Switch
					checked={settings.autoRedStatus}
					onCheckedChange={(checked) => onChange("autoRedStatus", checked)}
					aria-label={t(localizationConstants.forecastRiskAutoRedTitle)}
					className="cursor-pointer"
				/>
			</div>

			<Button
				type="submit"
				className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
			>
				<Save className="h-4 w-4" aria-hidden />
				<Translate text={localizationConstants.forecastRiskSaveSettings} />
			</Button>
		</form>
	);
}

export default RiskSettingsTab;
