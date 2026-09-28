"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateCertificatePage } from "@/features/financial-management/components/certificates/CreateCertificatePage";
import { certificatesRepository } from "@/features/financial-management/utils/certificatesRepository";

function CreateCertificatePageContent() {
	const searchParams = useSearchParams();
	const editId = searchParams.get("id");
	const initialItem = editId ? certificatesRepository.getById(editId) : undefined;

	return (
		<CreateCertificatePage
			initialItem={initialItem}
			isEditMode={Boolean(initialItem)}
		/>
	);
}

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function CreateCertificateRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateCertificatePageContent />
		</Suspense>
	);
}
