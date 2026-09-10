"use client";

import { WarrantyFeature } from "@/features/warranty/WarrantyFeature";

export interface OrderWarrantyDetailPageProps {
	id: string;
}

/** The Order module's `/warranty/[id]` route: the shared detail, entered directly. */
export function OrderWarrantyDetailPage({ id }: OrderWarrantyDetailPageProps) {
	return <WarrantyFeature recordId={id} initialView="detail" />;
}

export default OrderWarrantyDetailPage;
