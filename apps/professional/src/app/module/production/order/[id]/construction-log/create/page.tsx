import { Suspense } from "react";
import { CreateConstructionLogPage } from "@/features/orders/construction-log/create/CreateConstructionLogPage";

interface CreateConstructionLogPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function CreateConstructionLogPageRoute({
	params,
}: CreateConstructionLogPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<CreateConstructionLogPage orderId={id} />
		</Suspense>
	);
}
