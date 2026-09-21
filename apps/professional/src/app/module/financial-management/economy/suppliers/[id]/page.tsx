"use client";

import React, { use } from "react";
import { SupplierDetailPage } from "@/features/financial-management/components/suppliers/detail";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function SupplierDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	const decodedId = decodeURIComponent(id);

	return <SupplierDetailPage id={decodedId} />;
}
