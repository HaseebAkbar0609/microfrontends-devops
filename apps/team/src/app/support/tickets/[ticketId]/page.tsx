import { notFound } from "next/navigation";
import TicketDetailPage from "@/features/support/components/ticket/TicketDetailPage";
import { parseTicketId } from "@/features/support/schemas/supportTicket.schema";

type TicketPageProps = {
	params: Promise<{ ticketId: string }>;
};

export default async function Page({ params }: TicketPageProps) {
	const { ticketId } = await params;
	const parsedTicketId = parseTicketId(ticketId);
	if (!parsedTicketId) notFound();

	return <TicketDetailPage ticketId={parsedTicketId} />;
}
