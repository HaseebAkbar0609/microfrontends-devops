"use client";

import axiosInstance from "@/lib/axiosInstance";
import type { LeadSettingsApiData, LeadSettingsApiResponse } from "@/features/leads/settings/types/leadSettingsApi";

const LEAD_SETTINGS_PATH = "/api/v1/lead-settings";
const LEAD_SETTINGS_UPDATE_PATH = "/api/v1/lead-settings/update";

function extractLeadSettingsData(payload: unknown): LeadSettingsApiData | null {
	if (!payload || typeof payload !== "object") return null;
	const candidate = (payload as { data?: unknown }).data ?? payload;
	if (candidate && typeof candidate === "object") {
		if ("data" in candidate && (candidate as { data?: unknown }).data) {
			const nested = (candidate as { data?: unknown }).data;
			if (nested && typeof nested === "object") return nested as LeadSettingsApiData;
		}
		if ("review_mode" in candidate || "monitor_mode" in candidate) {
			return candidate as LeadSettingsApiData;
		}
	}
	return null;
}

export async function fetchLeadSettings(): Promise<LeadSettingsApiData | null> {
	const response = await axiosInstance.get<LeadSettingsApiResponse>(LEAD_SETTINGS_PATH);
	if (process.env.NODE_ENV !== "production") {
		console.debug("Lead settings GET response:", response.data);
	}
	const apiData = extractLeadSettingsData(response.data);
	if (!apiData || Object.keys(apiData).length === 0) return null;
	return apiData;
}

export async function updateLeadSettings(
	payload: LeadSettingsApiData
): Promise<LeadSettingsApiData | null> {
	const response = await axiosInstance.put<LeadSettingsApiResponse>(
		LEAD_SETTINGS_UPDATE_PATH,
		payload
	);
	if (process.env.NODE_ENV !== "production") {
		console.debug("Lead settings PUT response:", response.data);
	}
	return extractLeadSettingsData(response.data);
}
