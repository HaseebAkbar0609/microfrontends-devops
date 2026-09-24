import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignEkonomiPage } from "@/features/design/ekonomi/DesignEkonomiPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignEkonomiPage projektId={parseRecordIdParam(id)} />;
}
