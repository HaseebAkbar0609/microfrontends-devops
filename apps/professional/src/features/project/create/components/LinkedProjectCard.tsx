"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import { SearchableSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { listProfessionalProjects } from "../../services/professionalProjectService";
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
	const { company, isAuthenticated } = useAuthStatus();
	const projects = useQuery({
		queryKey: ["professional-projects", company?.id, false],
		queryFn: () => listProfessionalProjects(false),
		enabled: Boolean(company?.id && isAuthenticated),
	});
	const options = (projects.data ?? []).map((project) => ({
		value: project.projectNr,
		label: `${project.projectNr} - ${project.name}`,
	}));

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
								options={options}
								allowCustom={false}
								placeholder={t(
									localizationConstants.projectCreateLinkedNoLabel,
								)}
								searchPlaceholder={t(localizationConstants.search)}
							/>
						)}
					/>
					{projects.isError && <p role="alert" className="text-sm text-red-700">
						<Translate text={localizationConstants.genericError} />
					</p>}
				</div>
			</CardContent>
		</Card>
	);
}

export default LinkedProjectCard;
