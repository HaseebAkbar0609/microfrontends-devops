"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
	CertificateDetailPage,
	certificatesRepository,
	CREATE_CERTIFICATE_ROUTE,
	CERTIFICATES_BASE_ROUTE,
} from "@/features/financial-management";
import type { CertificateItem } from "@/features/financial-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CertificateDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	const router = useRouter();
	const item = certificatesRepository.getById(id);

	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
				<p className="text-base font-semibold text-slate-800 mb-2">
					<Translate text={localizationConstants.certNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(CERTIFICATES_BASE_ROUTE)}
					className="gap-2 text-xs"
				>
					<ArrowLeft className="w-4 h-4" />
					<Translate text={localizationConstants.btnBackToList} />
				</Button>
			</div>
		);
	}

	const handleEdit = (certItem: CertificateItem) => {
		router.push(`${CREATE_CERTIFICATE_ROUTE}?id=${certItem.id}`);
	};

	return <CertificateDetailPage item={item} onEdit={handleEdit} />;
}
