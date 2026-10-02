"use client";

import { useMemo, useState } from "react";
import { Contact, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ACCESS_NEW_LIMITS } from "../../constants/accessNewLimits.constants";
import { useAccessNewDraft } from "../../context/AccessNewDraftContext";
import { ACCESS_PERSON_OPTIONS } from "../../data/accessNewOptions.mock";
import type { AccessContactErrors, AccessNewContact, AccessNewContactDraft } from "../../types/accessNew.types";
import { validateContact } from "../../utils/accessNew";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessFormField, AccessSelectField } from "./AccessFormField";

const EMPTY_DRAFT: AccessNewContactDraft = { person: "", email: "", mobile: "" };
const PERSON_OPTIONS = ACCESS_PERSON_OPTIONS.map((person) => ({ value: person.name, label: person.name }));

/**
 * "Contact Person" card: pick a person (their email and mobile fill in), save to add them
 * to the table below, and remove a row after a confirmation.
 */
export function AccessNewContactCard({ onRemove }: { onRemove: (contact: AccessNewContact) => void }) {
	const t = useTranslate();
	const { contacts, addContact } = useAccessNewDraft();
	const [draft, setDraft] = useState<AccessNewContactDraft>(EMPTY_DRAFT);
	const [errors, setErrors] = useState<AccessContactErrors>({});

	const choosePerson = (name: string) => {
		const person = ACCESS_PERSON_OPTIONS.find((option) => option.name === name);
		setDraft({ person: name, email: person?.email ?? "", mobile: person?.mobile ?? "" });
	};

	const save = () => {
		const found = validateContact(draft, contacts);
		setErrors(found);
		if (Object.keys(found).length > 0) return;
		const added = addContact(draft);
		showToast("success", t(localizationConstants.accessNewContactAddedToast, { name: added.name }));
		setDraft(EMPTY_DRAFT);
	};

	const columns = useMemo<DataTableColumn<AccessNewContact>[]>(
		() => [
			{ key: "name", label: localizationConstants.accessContactResponsible, sortable: false, cellClassName: "text-slate-900" },
			{ key: "email", label: localizationConstants.email },
			{ key: "mobile", label: localizationConstants.accessContactMobile },
		],
		[],
	);

	return (
		<AccessSectionCard icon={<Contact className="h-5 w-5" aria-hidden />} title={localizationConstants.accessSectionContact}>
			<div className="flex flex-col gap-4 p-4">
				<AccessSelectField
					id="access-new-person"
					label={localizationConstants.accessContactResponsible}
					placeholder={localizationConstants.accessNewSelectPlaceholder}
					value={draft.person}
					onChange={choosePerson}
					options={PERSON_OPTIONS}
					error={errors.person}
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<AccessFormField id="access-new-email" label={localizationConstants.email} error={errors.email} max={ACCESS_NEW_LIMITS.email}>
						<Input
							id="access-new-email"
							type="email"
							value={draft.email}
							onChange={(event) => setDraft({ ...draft, email: event.target.value })}
							aria-invalid={errors.email ? true : undefined}
							aria-describedby={errors.email ? "access-new-email-error" : undefined}
						/>
					</AccessFormField>
					<AccessFormField id="access-new-mobile" label={localizationConstants.accessContactMobile} error={errors.mobile} max={ACCESS_NEW_LIMITS.mobile}>
						<Input
							id="access-new-mobile"
							value={draft.mobile}
							onChange={(event) => setDraft({ ...draft, mobile: event.target.value })}
							aria-invalid={errors.mobile ? true : undefined}
							aria-describedby={errors.mobile ? "access-new-mobile-error" : undefined}
						/>
					</AccessFormField>
				</div>
				<Button type="button" className="h-9 cursor-pointer self-end bg-zinc-900 px-5 text-white hover:bg-zinc-800" onClick={save}>
					<Translate text={localizationConstants.save} />
				</Button>

				<div className="overflow-hidden rounded-md border border-slate-200">
					<h3 className="bg-slate-200/70 px-4 py-3 text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.accessNewAddedContacts} />
					</h3>
					<div className="p-4">
						<DataTable
							data={contacts}
							columns={columns}
							rowKey={(contact) => contact.id}
							emptyMessageKey={localizationConstants.accessNewContactsEmpty}
							primaryAction={(contact) => (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="cursor-pointer"
									aria-label={t(localizationConstants.accessNewRemoveLabel, { name: contact.name })}
									onClick={() => onRemove(contact)}
								>
									<Trash2 className="h-4 w-4" aria-hidden />
								</Button>
							)}
						/>
					</div>
				</div>
			</div>
		</AccessSectionCard>
	);
}
