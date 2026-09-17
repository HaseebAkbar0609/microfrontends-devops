import { parseRecordIdParam } from "@/lib/routeParams";

import SupplierAtaViewPage from "@/features/project/production/ata/leverantor/view/SupplierAtaViewPage";

interface PageProps {
	params: Promise<{ id: string; ataId: string }>;
}

/**
 * A subcontractor's or supplier's ÄTA. `leverantor` is a static segment, so
 * Next matches it before the project's own `[ataId]`. Both ids are validated
 * here; the ÄTA is resolved on the client, which 404s one that is not this
 * project's.
 */
export default async function Page({ params }: PageProps) {
	const { id, ataId } = await params;

	return <SupplierAtaViewPage projectId={parseRecordIdParam(id)} ataId={parseRecordIdParam(ataId)} />;
}
