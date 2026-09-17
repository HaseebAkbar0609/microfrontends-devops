"use client";

import React, { use } from "react";
import { ClaimTemplateDetailPage } from "@/features/financial-management/components/claims/templates/detail";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function ClaimTemplateDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	// Handle decoded IDs like %23MA001 -> #MA001
	const decodedId = decodeURIComponent(id);

	return <ClaimTemplateDetailPage templateId={decodedId} />;
}
