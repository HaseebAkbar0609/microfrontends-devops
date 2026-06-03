"use client";

import { useParams } from "next/navigation";
import { SupplierDetailPage } from "@/features/supplier/components/SupplierDetailPage";

export default function SupplierDetailRoute() {
	const params = useParams();
	const supplierId = params.supplierId as string;
	return <SupplierDetailPage supplierId={supplierId} />;
}
