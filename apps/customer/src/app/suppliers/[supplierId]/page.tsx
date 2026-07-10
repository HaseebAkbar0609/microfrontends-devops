"use client";

import { useParams } from "next/navigation";
import { SupplierDetailPage } from "@/components/tools-suppliers/detail/SupplierDetailPage";

export default function SupplierDetailRoute() {
	const params = useParams();
	const supplierId = params.supplierId as string;
	return <SupplierDetailPage supplierId={supplierId} />;
}
