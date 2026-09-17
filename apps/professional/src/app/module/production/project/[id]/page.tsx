import { redirect } from "next/navigation";

import { parseRecordIdParam } from "@/lib/routeParams";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** A project record opens on its first section, as an order record does. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	redirect(
		`/module/production/project/${encodeURIComponent(parseRecordIdParam(id))}/projektinformation`,
	);
}
