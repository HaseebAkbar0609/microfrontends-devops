export type LeadSettingsApiData = {
	id?: string;
	review_mode?: string;
	monitor_mode?: string;
	review_schedule?: Record<string, unknown>;
	monitor_schedule?: Record<string, unknown>;
	monitor_days_for_reshipment?: number;
	match_by_category_region?: boolean;
	consider_company_rating?: boolean;
	prioritize_response_rate?: boolean;
	max_companies?: number;
	default_owner_email?: string;
	send_reminder?: boolean;
	notify_owner?: boolean;
	escalate?: boolean;
	escalation_email?: string;
	reminder_after_hours?: number;
	escalate_after_hours?: number;
	is_active?: boolean;
};

export type LeadSettingsApiResponse = {
	success?: boolean;
	message?: string;
	data?: LeadSettingsApiData;
};
