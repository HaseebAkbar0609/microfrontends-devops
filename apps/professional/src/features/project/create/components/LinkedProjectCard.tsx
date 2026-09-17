"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { SearchableSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { LINKABLE_PROJECT_OPTIONS } from "../data/projectCreateOptions.mock";
import type { CreateProjectFormData } from "../types";

export interface LinkedProjectCardProps {
	form: UseFormReturn<CreateProjectFormData>;
}

/**
 * "Koppla projekt" — hangs the new project off an existing one.
 *
 * The only card in the wizard with no counterpart in the order flow. It offers
 * the projects that already exist rather than free text, since a link that
 * names nothing is the same as no link.
 */
export function LinkedProjectCard({ form }: LinkedProjectCardProps) {
	const t = useTranslate();

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="border-b border-slate-200 px-6 py-4">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate
						text={localizationConstants.projectCreateLinkSection}
					/>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				<div className="space-y-1 sm:max-w-[calc(50%-1rem)]">
					<Label className="text-sm font-medium text-slate-700">
						<Translate
							text={localizationConstants.projectCreateLinkedNoLabel}
						/>
					</Label>
					<Controller
						control={form.control}
						name="details.linkedProjectNo"
						render={({ field }) => (
							<SearchableSelect
								value={field.value}
								onChange={field.onChange}
								options={LINKABLE_PROJECT_OPTIONS}
								allowCustom={false}
								placeholder={t(
									localizationConstants.projectCreateLinkedNoLabel,
								)}
								searchPlaceholder={t(localizationConstants.search)}
							/>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export default LinkedProjectCard;
