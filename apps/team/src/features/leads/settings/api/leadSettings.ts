"use client";

import axiosInstance from "@/lib/axiosInstance";
import type { LeadSettingsApiData, LeadSettingsApiResponse } from "@/features/leads/settings/types/leadSettingsApi";

const LEAD_SETTINGS_PATH = "/api/v1/teams/lead-settings";
const LEAD_SETTINGS_UPDATE_PATH = "/api/v1/teams/lead-settings/update";

import { z } from "zod";

export const LeadSettingsDataSchema = z.object({
	id: z.string().optional(),
	review_mode: z.string().optional(),
	monitor_mode: z.string().optional(),
	review_schedule: z.record(z.unknown()).optional().nullable(),
	monitor_schedule: z.record(z.unknown()).optional().nullable(),
	monitor_days_for_reshipment: z.number().optional().nullable(),
	match_by_category_region: z.boolean().optional().nullable(),
	consider_company_rating: z.boolean().optional().nullable(),
	prioritize_response_rate: z.boolean().optional().nullable(),
	max_companies: z.number().optional().nullable(),
	default_owner_email: z.string().optional().nullable(),
	send_reminder: z.boolean().optional().nullable(),
	notify_owner: z.boolean().optional().nullable(),
	escalate: z.boolean().optional().nullable(),
	escalation_email: z.string().optional().nullable(),
	reminder_after_hours: z.number().optional().nullable(),
	escalate_after_hours: z.number().optional().nullable(),
	is_active: z.boolean().optional().nullable(),
	permissions_matrix: z.array(z.record(z.unknown())).optional().nullable(),
});

function extractLeadSettingsData(payload: unknown): LeadSettingsApiData | null {
	if (!payload || typeof payload !== "object") return null;
	const candidate = (payload as { data?: unknown }).data ?? payload;
	let target: unknown = candidate;
	if (candidate && typeof candidate === "object" && "data" in candidate && (candidate as { data?: unknown }).data) {
		target = (candidate as { data?: unknown }).data;
	}
	
	try {
		const parsed = LeadSettingsDataSchema.parse(target);
		return parsed as LeadSettingsApiData;
	} catch {
		if (target && typeof target === "object") {
			return target as LeadSettingsApiData;
		}
		return null;
	}
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
