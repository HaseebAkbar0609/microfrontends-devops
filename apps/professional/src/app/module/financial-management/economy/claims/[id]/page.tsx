"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	ClaimDetailPage,
	claimsRepository,
	CLAIMS_BASE_ROUTE,
	CREATE_CLAIM_ROUTE,
} from "@/features/financial-management";
import type { ClaimItem } from "@/features/financial-management";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function ClaimDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	const router = useRouter();
	const item = claimsRepository.getById(id);

	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
				<p className="text-base font-semibold text-slate-800 mb-2">
					<Translate text={localizationConstants.claimsNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(CLAIMS_BASE_ROUTE)}
					className="gap-2 text-xs"
				>
					<ArrowLeft className="w-4 h-4" />
					<Translate text={localizationConstants.btnBackToOverviewYearEnd} />
				</Button>
			</div>
		);
	}

	const handleEdit = (claimItem: ClaimItem) => {
		router.push(`${CREATE_CLAIM_ROUTE}?id=${claimItem.id}`);
	};

	return <ClaimDetailPage item={item} onEdit={handleEdit} />;
}
