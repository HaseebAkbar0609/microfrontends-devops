import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignTidsplanPage } from "@/features/design/tidsplan/DesignTidsplanPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignTidsplanPage projektId={parseRecordIdParam(id)} />;
}
