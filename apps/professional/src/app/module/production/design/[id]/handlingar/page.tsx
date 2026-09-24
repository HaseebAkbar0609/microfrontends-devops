import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignHandlingarPage } from "@/features/design/handlingar/DesignHandlingarPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignHandlingarPage projektId={parseRecordIdParam(id)} />;
}
