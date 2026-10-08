import { use } from "react";
import { DataItDetailView } from "@/features/data-it";

export default function DataItDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	return <DataItDetailView id={unwrappedParams.id} />;
}
