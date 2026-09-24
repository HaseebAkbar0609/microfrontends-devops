import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignProtocolsPage } from "@/features/design/protokoll/DesignProtocolsPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignProtocolsPage projektId={parseRecordIdParam(id)} />;
}
