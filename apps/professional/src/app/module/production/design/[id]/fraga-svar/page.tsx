import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignQaPage } from "@/features/design/fraga-svar/DesignQaPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignQaPage projektId={parseRecordIdParam(id)} />;
}
