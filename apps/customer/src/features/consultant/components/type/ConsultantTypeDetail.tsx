"use client";

import { Building2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { consultantTypeNameKey } from "../../utils/typeName";
import type { ConsultantTypeItem } from "../../types/consultantType";

interface ConsultantTypeDetailProps {
	type: ConsultantTypeItem | null;
}

export function ConsultantTypeDetail({ type }: ConsultantTypeDetailProps) {
	if (!type) return null;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3">
				<Building2 className="h-6 w-6 text-slate-700" aria-hidden />
				<h2 className="text-2xl font-semibold text-slate-900">
					<Translate text={consultantTypeNameKey(type.name)} />
				</h2>
			</div>

			{type.sections.map((section, index) => (
				<section
					key={`${type.id}-section-${index}`}
					className="flex flex-col gap-2"
				>
					<h3 className="text-base font-semibold text-slate-900">
						<Translate text={section.title} />:
					</h3>
					<ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-slate-600">
						{section.bullets.map((bullet, bulletIndex) => (
							<li key={`${type.id}-bullet-${index}-${bulletIndex}`}>
								<Translate text={bullet} />
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
