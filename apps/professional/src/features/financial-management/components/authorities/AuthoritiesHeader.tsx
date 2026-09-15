"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function AuthoritiesHeader() {
	return (
		<div className="mb-6">
			<h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
				<Translate text={localizationConstants.titleAuthorities} />
			</h1>
			<div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1.5 font-medium">
				<span>
					<Translate text={localizationConstants.breadcrumbHome} />
				</span>
				<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
				<span>
					<Translate text={localizationConstants.breadcrumbModule} />
				</span>
				<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
				<span>
					<Translate text={localizationConstants.economy} />
				</span>
				<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
				<span className="text-[#0F172A] font-semibold">
					<Translate text={localizationConstants.breadcrumbAuthorities} />
				</span>
			</div>
		</div>
	);
}

export default AuthoritiesHeader;
