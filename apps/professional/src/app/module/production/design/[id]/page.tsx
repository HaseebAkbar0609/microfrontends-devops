import { redirect } from "next/navigation";
import { parseRecordIdParam } from "@/lib/routeParams";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	redirect(
		`/module/production/design/${encodeURIComponent(parseRecordIdParam(id))}/projektinformation`,
	);
}
