import LeadDetailView from "@/features/leads/management/components/LeadDetailView";
import { previewLead } from "@/features/leads/management/constants/previewLead";

export default function Page() {
	return <LeadDetailView lead={previewLead} />;
}
