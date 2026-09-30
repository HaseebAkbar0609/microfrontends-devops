"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useSalesSettings } from "../../hooks/useSalesSettings";
import { isValidLink } from "../../utils/salesTemplates";
import { EmailTemplateCard } from "./EmailTemplateCard";

/** Presentation emails and the booking link used from a customer card. */
export default function SalesSettingsPage() {
	const {
		calendlyLink,
		setCalendlyLink,
		templates,
		addTemplate,
		updateTemplate,
		removeTemplate,
		isLoading,
		isError,
	} = useSalesSettings();
	const t = useTranslate();
	const linkIsValid = isValidLink(calendlyLink);

	const handleAdd = () => {
		addTemplate();
		showToast("success", t(localizationConstants.salesSettingsTemplateAddedToast));
	};

	const handleRemove = (templateId: string) => {
		removeTemplate(templateId);
		showToast(
			"success",
			t(localizationConstants.salesSettingsTemplateRemovedToast),
		);
	};

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="border-b border-slate-200 bg-white px-6 py-4">
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.salesNavSettings} />
				</h1>
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesSettingsSubtitle} />
				</p>
			</header>

			<div className="p-6">
				{isLoading || isError ? (
					<p className="text-sm text-slate-600">
						<Translate
							text={isLoading
								? localizationConstants.salesSettingsLoading
								: localizationConstants.salesSettingsLoadFailed}
						/>
					</p>
				) : (
				<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
						<h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
							<SlidersHorizontal className="h-4 w-4 text-slate-500" />
							<Translate text={localizationConstants.salesSettingsCardTitle} />
						</h2>
						<Button
							type="button"
							variant="outline"
							className="h-10 gap-2 active:scale-[0.98]"
							onClick={handleAdd}
						>
							<Plus className="h-4 w-4" />
							<Translate
								text={localizationConstants.salesSettingsAddTemplateButton}
							/>
						</Button>
					</div>

					<div className="flex flex-col gap-6 px-5 py-5">
						<div className="flex flex-col gap-1.5">
							<label
								className="text-sm font-medium text-slate-900"
								htmlFor="calendly-link"
							>
								<Translate
									text={localizationConstants.salesSettingsCalendlyLabel}
								/>
							</label>
							<Input
								id="calendly-link"
								type="url"
								className="max-w-2xl"
								aria-invalid={!linkIsValid}
								value={calendlyLink}
								onChange={(event) => setCalendlyLink(event.target.value)}
							/>
							<p
								className={`text-sm ${linkIsValid ? "text-slate-500" : "text-red-600"}`}
							>
								<Translate
									text={
										linkIsValid
											? localizationConstants.salesSettingsCalendlyHint
											: localizationConstants.salesSettingsCalendlyInvalid
									}
								/>
							</p>
						</div>

						<div className="flex flex-col gap-3">
							<div>
								<h3 className="text-base font-semibold text-slate-900">
									<Translate
										text={localizationConstants.salesSettingsTemplatesTitle}
									/>
								</h3>
								<p className="text-sm text-slate-500">
									<Translate text={localizationConstants.salesSettingsTagsHint} />
								</p>
							</div>

							{templates.length === 0 ? (
								<p className="rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
									<Translate
										text={localizationConstants.salesSettingsNoTemplates}
									/>
								</p>
							) : (
								templates.map((template) => (
									<EmailTemplateCard
										key={template.id}
										template={template}
										onChange={(patch) => updateTemplate(template.id, patch)}
										onRemove={() => handleRemove(template.id)}
									/>
								))
							)}
						</div>
					</div>
				</section>
				)}
			</div>
		</div>
	);
}
