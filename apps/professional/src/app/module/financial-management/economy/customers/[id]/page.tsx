"use client";

import React, { use } from "react";
import { CustomerDetailPage } from "@/features/financial-management/components/customers/detail";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CustomerDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	const decodedId = decodeURIComponent(id);

	return <CustomerDetailPage id={decodedId} />;
}
