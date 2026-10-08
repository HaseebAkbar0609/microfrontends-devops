import { use } from "react";
import { DataItSystemDetailView } from "@/features/data-it";

export default function SystemDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	return <DataItSystemDetailView id={unwrappedParams.id} />;
}
