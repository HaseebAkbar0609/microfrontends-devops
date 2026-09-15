"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AuthorityDetailPage } from "@/features/financial-management/components/authorities";

function AuthorityDetailContent() {
	const params = useParams<{ id: string }>();
	const authorityId = params?.id || "";

	return <AuthorityDetailPage authorityId={authorityId} />;
}

export default function EconomyAuthorityDetailPage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<AuthorityDetailContent />
		</Suspense>
	);
}
