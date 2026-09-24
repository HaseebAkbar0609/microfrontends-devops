import React, { Suspense } from "react";
import { CaseDetailPage } from "@/features/financial-management/components/cases/detail";
import { Loader2 } from "lucide-react";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center p-12 text-slate-400">
					<Loader2 className="w-5 h-5 animate-spin" />
				</div>
			}
		>
			<CaseDetailPage id={id} />
		</Suspense>
	);
}
