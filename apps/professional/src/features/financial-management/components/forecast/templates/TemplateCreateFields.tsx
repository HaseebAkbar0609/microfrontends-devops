"use client";

import { RecordFilePicker } from "@/components/form/RecordFilePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	TEMPLATE_CATEGORIES,
	TEMPLATE_CATEGORY_LABELS,
	TEMPLATE_DESCRIPTION_MAX_LENGTH,
	TEMPLATE_FILE_ACCEPT,
	TEMPLATE_FILE_PICKER_COPY,
	TEMPLATE_FILE_RULES,
	TEMPLATE_NAME_MAX_LENGTH,
} from "../../../constants/forecastTemplates.constants";
import type { TemplateCategory } from "../../../types/forecastTemplates.types";
import type { TemplateCreateFormState } from "../../../hooks/useTemplateCreateForm";

export interface TemplateCreateFieldsProps {
	form: TemplateCreateFormState;
}

/**
 * The four fields a new template is made of.
 *
 * The file comes before the name because the file names the document: asking
 * for the name first would mean overwriting something just typed.
 */
export function TemplateCreateFields({ form }: TemplateCreateFieldsProps) {
	const t = useTranslate();

	return (
		<>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="template-category" className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.forecastTemplatesColCategory} />
					<span aria-hidden className="text-red-600">
						*
					</span>
				</Label>
				<Select
					value={form.category ?? undefined}
					onValueChange={(next) => form.setCategory(next as TemplateCategory)}
				>
					<SelectTrigger id="template-category" className="h-10 w-full cursor-pointer border-slate-200">
						<SelectValue placeholder={t(localizationConstants.forecastTemplatesCategoryPlaceholder)} />
					</SelectTrigger>
					<SelectContent className="bg-white">
						{TEMPLATE_CATEGORIES.map((option) => (
							<SelectItem key={option} value={option} className="cursor-pointer">
								<Translate text={TEMPLATE_CATEGORY_LABELS[option]} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{form.categoryError && (
					<p className="text-xs text-red-600">
						<Translate text={form.categoryError} />
					</p>
				)}
			</div>

			<RecordFilePicker
				file={form.file}
				onChange={form.setFile}
				error={form.fileError}
				onError={form.setFileError}
				rules={TEMPLATE_FILE_RULES}
				accept={TEMPLATE_FILE_ACCEPT}
				copy={TEMPLATE_FILE_PICKER_COPY}
			/>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="template-name" className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.forecastTemplatesColName} />
					<span aria-hidden className="text-red-600">
						*
					</span>
				</Label>
				<Input
					id="template-name"
					value={form.documentName}
					onChange={(event) => form.setDocumentName(event.target.value)}
					maxLength={TEMPLATE_NAME_MAX_LENGTH}
					placeholder={t(localizationConstants.forecastTemplatesNamePlaceholder)}
					className="h-10 border-slate-200"
				/>
				{form.nameError && (
					<p className="text-xs text-red-600">
						<Translate text={form.nameError} />
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="template-description" className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.forecastTemplatesFieldDescription} />
				</Label>
				<Textarea
					id="template-description"
					value={form.description}
					onChange={(event) => form.setDescription(event.target.value)}
					maxLength={TEMPLATE_DESCRIPTION_MAX_LENGTH}
					rows={3}
					placeholder={t(localizationConstants.forecastTemplatesDescriptionPlaceholder)}
					className="border-slate-200"
				/>
			</div>
		</>
	);
}

export default TemplateCreateFields;
