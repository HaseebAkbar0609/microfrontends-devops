"use client";

import { use } from "react";
import { DiscountDetailPage } from "@/features/tools/discount/components/DiscountDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	return <DiscountDetailPage partnerId={id} />;
}
