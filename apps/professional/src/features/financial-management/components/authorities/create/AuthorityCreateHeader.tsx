"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ECONOMY_AUTHORITIES_BASE_URL } from "../../../constants/authorities.constants";

export function AuthorityCreateHeader() {
	const router = useRouter();

	return (
		<div className="bg-white border-b border-slate-200 px-6 py-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
					className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
					aria-label="Back"
				>
					<ArrowLeft className="w-5 h-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.createAuthorityTitle} />
				</h1>
			</div>
		</div>
	);
}

export default AuthorityCreateHeader;
