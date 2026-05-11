import LeadDetailPageClient from "@/features/leads/management/components/LeadDetailPageClient";

type PageProps = {
	params: Promise<{ leadId: string }>;
};

export default async function Page({ params }: PageProps) {
	const { leadId } = await params;
	return <LeadDetailPageClient leadId={leadId} />;
}
