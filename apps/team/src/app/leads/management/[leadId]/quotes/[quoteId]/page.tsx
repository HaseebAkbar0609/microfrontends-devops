import QuoteDetailView from "@/features/leads/management/components/QuoteDetailView";

type QuoteDetailPageProps = {
	params: Promise<{ leadId: string; quoteId: string }>;
};

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
	const { leadId, quoteId } = await params;
	return <QuoteDetailView leadId={leadId} quoteId={quoteId} />;
}
