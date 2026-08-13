"use client";

import { useEffect, useState, use } from "react";
import { EditAgreementPage } from "@/features/agreement/components/EditAgreementPage";
import { getAgreementDetailAction } from "@/api-actions/agreements/agreements";
import { AgreementDetail } from "@/features/agreement/types/agreementDetail";
import { Loader } from "@/components/ui/loader";

export default function AgreementEditPage({ params }: { params: Promise<{ id: string }> }) {
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
			<div className="flex flex-1 flex-col items-center justify-center bg-slate-50 gap-4">
				<div className="text-lg font-medium text-slate-500">
					Agreement not found
				</div>
			</div>
		);
	}

	return <EditAgreementPage agreement={data} />;
}
