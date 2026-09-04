"use client";

import { useEffect, useState, use } from "react";
import AgreementDetailView from "@/features/agreement/components/AgreementDetailView";
import { getAgreementDetailAction } from "@/api-actions/agreements/agreements";
import { AgreementDetail } from "@/features/agreement/types/agreementDetail";
import { Loader } from "@/components/ui/loader";

export default function AgreementDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const unwrappedParams = use(params);
	const id = unwrappedParams.id;
	
	const [data, setData] = useState<AgreementDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchDetail() {
			try {
				const res = await getAgreementDetailAction(id);
				if (res.success && res.data) {
					setData(res.data);
				}
			} finally {
				setIsLoading(false);
			}
		}
		fetchDetail();
	}, [id]);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center bg-slate-50">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-1 items-center justify-center bg-slate-50">
				<p className="text-slate-500">Agreement not found.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			<AgreementDetailView data={data} />
		</div>
	);
}

