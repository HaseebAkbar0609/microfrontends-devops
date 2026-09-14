"use client";

import React, { Suspense } from "react";
import { CreateAuthorityWizard } from "@/features/financial-management/components/authorities";

export default function CreateAuthorityPage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<CreateAuthorityWizard />
		</Suspense>
	);
}
