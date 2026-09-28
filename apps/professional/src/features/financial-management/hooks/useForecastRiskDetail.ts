"use client";

import { useCallback, useMemo, useState } from "react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { INITIAL_RISK_CLIENTS } from "../mock/forecastRisk.mock";
import type { RiskClient, RiskClientSettings } from "../types/forecastRisk.types";
import { riskClientTotals } from "../utils/forecastRisk";

/**
 * One client's screen: the client itself, its derived figures, and the
 * thresholds its Settings tab edits. The settings are held here rather than
 * written back to the register, since there is no credit API to save them to;
 * the figures on the Objekt tab follow the edits so the reader can see what a
 * threshold change would mean.
 */
export function useForecastRiskDetail(id: string) {
	const t = useTranslate();
	const stored = useMemo(() => INITIAL_RISK_CLIENTS.find((item) => item.id === id), [id]);
	const [settings, setSettings] = useState<RiskClientSettings | null>(stored?.settings ?? null);

	const client: RiskClient | undefined = useMemo(() => {
		if (!stored) return undefined;
		return settings ? { ...stored, settings } : stored;
	}, [stored, settings]);

	const totals = useMemo(() => (client ? riskClientTotals(client) : null), [client]);

	const setSetting = useCallback(<K extends keyof RiskClientSettings>(key: K, value: RiskClientSettings[K]) => {
		setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
	}, []);

	const save = useCallback(() => {
		showToast("success", t(localizationConstants.forecastRiskSettingsSaved));
	}, [t]);

	return { client, totals, settings, setSetting, save };
}

export type ForecastRiskDetailState = ReturnType<typeof useForecastRiskDetail>;
