"use client";

import { Plus, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ACCESS_TYPE_IDS, ACCESS_TYPE_LABELS } from "../../constants/access.constants";
import { ACCESS_NEW_LIMITS } from "../../constants/accessNewLimits.constants";
import type { AccessNewKeyFormState } from "../../hooks/useAccessNewKeyForm";
import type { AccessTypeId } from "../../types/access.types";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessFormField, AccessSelectField } from "./AccessFormField";

/**
 * "Access Object" card of step 2: the key's number (read-only), type, registration
 * number, dates, and the places it opens, added one at a time as tags.
 */
export function AccessNewKeyCard({ keyForm }: { keyForm: AccessNewKeyFormState }) {
	const t = useTranslate();
	const { form, setField, errors, tags, tagInput, setTagInput, tagError, submitTag, removeTag, keyId } = keyForm;
	const typeOptions = ACCESS_TYPE_IDS.map((id) => ({ value: id, label: t(ACCESS_TYPE_LABELS[id]) }));
	const tagsError = tagError ?? errors.accessTo;

	return (
		<AccessSectionCard icon={<UserPlus className="h-5 w-5" aria-hidden />} title={localizationConstants.accessItemSectionObject}>
			<div className="grid gap-4 p-4 sm:grid-cols-2">
				<AccessFormField id="access-new-key-id" label={localizationConstants.accessItemFieldKeyId}>
					<Input id="access-new-key-id" value={keyId} readOnly disabled className="bg-slate-100 text-slate-500" />
				</AccessFormField>
				<span className="hidden sm:block" aria-hidden />
				<AccessSelectField
					id="access-new-type"
					label={localizationConstants.accessColType}
					placeholder={localizationConstants.accessNewSelectPlaceholder}
					value={form.type}
					onChange={(value) => setField("type", value as AccessTypeId | "")}
					options={typeOptions}
					error={errors.type}
				/>
				<AccessFormField id="access-new-reg-no" label={localizationConstants.accessItemColRegNo} error={errors.regNo} max={ACCESS_NEW_LIMITS.regNo}>
					<Input
						id="access-new-reg-no"
						value={form.regNo}
						onChange={(event) => setField("regNo", event.target.value)}
						aria-invalid={errors.regNo ? true : undefined}
						aria-describedby={errors.regNo ? "access-new-reg-no-error" : undefined}
					/>
				</AccessFormField>
				<AccessFormField id="access-new-start" label={localizationConstants.accessItemColStartDate} error={errors.startDate}>
					<Input
						id="access-new-start"
						type="date"
						value={form.startDate}
						onChange={(event) => setField("startDate", event.target.value)}
						aria-invalid={errors.startDate ? true : undefined}
						aria-describedby={errors.startDate ? "access-new-start-error" : undefined}
					/>
				</AccessFormField>
				<AccessFormField id="access-new-return" label={localizationConstants.accessItemFieldReturnDate} error={errors.returnDate}>
					<Input
						id="access-new-return"
						type="date"
						value={form.returnDate}
						onChange={(event) => setField("returnDate", event.target.value)}
						aria-invalid={errors.returnDate ? true : undefined}
						aria-describedby={errors.returnDate ? "access-new-return-error" : undefined}
					/>
				</AccessFormField>

				<div className="sm:col-span-2">
					<AccessFormField id="access-new-access-to" label={localizationConstants.accessItemColAccessTo} error={tagsError} max={ACCESS_NEW_LIMITS.tag}>
						<div className="flex items-center gap-2">
							<Input
								id="access-new-access-to"
								value={tagInput}
								placeholder={t(localizationConstants.accessNewAccessToPlaceholder)}
								onChange={(event) => setTagInput(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										submitTag();
									}
								}}
								aria-invalid={tagsError ? true : undefined}
								aria-describedby={tagsError ? "access-new-access-to-error" : undefined}
							/>
							<Button type="button" className="h-9 cursor-pointer gap-1 bg-zinc-900 text-white hover:bg-zinc-800" onClick={submitTag}>
								<Plus className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.accessNewAddTag} />
							</Button>
						</div>
					</AccessFormField>
					{tags.length > 0 && (
						<ul className="mt-2 flex flex-wrap gap-2">
							{tags.map((tag) => (
								<li key={tag} className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-0.5 pl-2 pr-1 text-xs font-medium text-slate-900">
									{tag}
									<button
										type="button"
										className="cursor-pointer rounded p-0.5 hover:bg-slate-200"
										aria-label={t(localizationConstants.accessNewRemoveLabel, { name: tag })}
										onClick={() => removeTag(tag)}
									>
										<X className="h-3 w-3" aria-hidden />
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</AccessSectionCard>
	);
}
