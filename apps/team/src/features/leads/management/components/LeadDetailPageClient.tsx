"use client";

import LeadDetailView from "@/features/leads/management/components/LeadDetailView";
import { useLeadById } from "@/features/leads/queries/useLeadsList";

type LeadDetailPageClientProps = {
	leadId: string;
};

export default function LeadDetailPageClient({
	leadId,
}: LeadDetailPageClientProps) {
	const { data: lead, isPending, error } = useLeadById(leadId);

	if (isPending) {
		return (
			<div className="px-8 py-6 text-sm text-slate-500">Loading lead details...</div>
		);
	}

	if (!lead) {
		return (
			<div className="px-8 py-6 text-sm text-slate-500">
				{error instanceof Error ? error.message : "Lead not found."}
			</div>
		);
	}

	return <LeadDetailView lead={lead} />;
}
