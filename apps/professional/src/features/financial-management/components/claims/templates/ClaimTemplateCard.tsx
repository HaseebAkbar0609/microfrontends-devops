"use client";

import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimTemplate } from "../../../types/claims.types";

interface ClaimTemplateCardProps {
	template: ClaimTemplate;
	onUseTemplate: (template: ClaimTemplate) => void;
}

export function ClaimTemplateCard({
	template,
	onUseTemplate,
}: ClaimTemplateCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
			<div>
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-center gap-2.5">
						<div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
							<FileText className="w-5 h-5" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-slate-900">
								{template.name}
							</h3>
							<p className="text-xs text-slate-500 font-mono">#{template.id}</p>
						</div>
					</div>

					<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
						{template.deficiencyType}
					</span>
				</div>

				<div className="space-y-2 mb-4">
					<p className="text-xs font-medium text-slate-700">
						{template.title}
					</p>
					<p className="text-xs text-slate-500 line-clamp-3">
						{template.description}
					</p>
				</div>
			</div>

			<div className="pt-3 border-t border-slate-100 flex items-center justify-between">
				<span className="text-xs text-slate-400">
					<Translate text={localizationConstants.claimsFieldDesiredAction} />:{" "}
					<strong className="text-slate-700 font-medium">{template.desiredAction}</strong>
				</span>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() => onUseTemplate(template)}
					className="h-8 text-xs text-slate-700 hover:text-slate-900 gap-1.5 cursor-pointer border-slate-200"
				>
					<Translate text={localizationConstants.claimsBtnUseTemplate} />
					<ArrowRight className="w-3.5 h-3.5" />
				</Button>
			</div>
		</div>
	);
}

export default ClaimTemplateCard;
