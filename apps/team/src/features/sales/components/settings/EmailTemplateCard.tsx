"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SalesEmailTemplate } from "../../types";

type EmailTemplateCardProps = {
	template: SalesEmailTemplate;
	onChange: (patch: Partial<Omit<SalesEmailTemplate, "id">>) => void;
	onRemove: () => void;
};

/** One editable presentation email. */
export function EmailTemplateCard({
	template,
	onChange,
	onRemove,
}: EmailTemplateCardProps) {
	const t = useTranslate();
	// A template is only saved once it has a name, so say why nothing is saved yet.
	const nameMissing = !template.name.trim();

	return (
		<article className="rounded-xl border border-slate-200 bg-white p-5">
			<div className="grid gap-4 @3xl:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<label
						className="text-sm font-medium text-slate-700"
						htmlFor={`template-name-${template.id}`}
					>
						<Translate text={localizationConstants.salesSettingsTemplateName} />
					</label>
					<Input
						id={`template-name-${template.id}`}
						value={template.name}
						aria-invalid={nameMissing || undefined}
						aria-describedby={nameMissing ? `template-name-error-${template.id}` : undefined}
						onChange={(event) => onChange({ name: event.target.value })}
					/>
					{nameMissing && (
						<p id={`template-name-error-${template.id}`} className="text-sm text-red-600">
							<Translate text={localizationConstants.salesSettingsTemplateNameRequired} />
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label
						className="text-sm font-medium text-slate-700"
						htmlFor={`template-subject-${template.id}`}
					>
						<Translate text={localizationConstants.salesSettingsTemplateSubject} />
					</label>
					<Input
						id={`template-subject-${template.id}`}
						value={template.subject}
						onChange={(event) => onChange({ subject: event.target.value })}
					/>
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-1.5">
				<label
					className="text-sm font-medium text-slate-700"
					htmlFor={`template-body-${template.id}`}
				>
					<Translate text={localizationConstants.salesSettingsTemplateBody} />
				</label>
				<Textarea
					id={`template-body-${template.id}`}
					rows={8}
					value={template.body}
					onChange={(event) => onChange({ body: event.target.value })}
				/>
			</div>

			<ConfirmDialog
				title={t(localizationConstants.salesSettingsRemoveConfirmTitle)}
				description={t(
					localizationConstants.salesSettingsRemoveConfirmDescription,
				)}
				confirmText={t(localizationConstants.salesConfirmLabel)}
				cancelText={t(localizationConstants.salesCancelButton)}
				onConfirm={onRemove}
				trigger={
					<Button
						type="button"
						variant="ghost"
						className="mt-3 cursor-pointer gap-2 px-0 text-slate-600 hover:text-red-600 active:scale-[0.98]"
					>
						<Trash2 className="h-4 w-4" />
						<Translate text={localizationConstants.salesSettingsRemoveTemplate} />
					</Button>
				}
			/>
		</article>
	);
}
