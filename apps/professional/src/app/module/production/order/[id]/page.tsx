import { redirect } from "next/navigation";

interface OrderDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
	const { id } = await params;
	redirect(`/module/production/order/${id}/order-information`);
}
