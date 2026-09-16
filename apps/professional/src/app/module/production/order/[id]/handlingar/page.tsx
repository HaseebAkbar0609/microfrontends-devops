import { redirect } from "next/navigation";

interface OrderHandlingarPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderHandlingarPageRoute({
	params,
}: OrderHandlingarPageRouteProps) {
	const { id } = await params;
	redirect(`/module/production/order/${id}/documents`);
}
