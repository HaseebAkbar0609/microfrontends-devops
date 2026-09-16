"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimTemplate } from "../../../types/claims.types";
import { ClaimTemplateCard } from "./ClaimTemplateCard";

interface ClaimTemplatesListProps {
	templates: ClaimTemplate[];
	onUseTemplate: (template: ClaimTemplate) => void;
}

export function ClaimTemplatesList({
	templates,
	onUseTemplate,
}: ClaimTemplatesListProps) {
	if (templates.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500 shadow-2xs">
				<Translate text={localizationConstants.claimsNoTemplatesFound} />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{templates.map((tpl) => (
				<ClaimTemplateCard
					key={tpl.id}
					template={tpl}
					onUseTemplate={onUseTemplate}
				/>
			))}
		</div>
	);
}

export default ClaimTemplatesList;
