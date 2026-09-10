"use client";

import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";

import { SearchableSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CONTRACTOR_TYPE_OPTIONS } from "../data/projectCreateOptions.mock";
import type { CreateProjectFormData, ProjectContactPerson } from "../types";
import { ContactPersonDialog } from "../components/ContactPersonDialog";
import { ContactPersonsTable } from "../components/ContactPersonsTable";
import { OrganisationDetailsCard } from "../components/OrganisationDetailsCard";

export interface Step4OrganisationProps {
	form: UseFormReturn<CreateProjectFormData>;
	onContactsChange: (contacts: ProjectContactPerson[]) => void;
}

/** Entreprenör, Organisation and the Kontaktpersoner list. */
export function Step4Organisation({
	form,
	onContactsChange,
}: Step4OrganisationProps) {
	const t = useTranslate();
	const { control, watch, formState } = form;

	const [editing, setEditing] = useState<ProjectContactPerson | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const contacts = watch("organisation.contacts") ?? [];
	const typeError = formState.errors.organisation?.contractorType;

	const openDialog = (contact: ProjectContactPerson | null) => {
		setEditing(contact);
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditing(null);
	};

	const saveContact = (contact: ProjectContactPerson) => {
		const exists = contacts.some((row) => row.id === contact.id);
		onContactsChange(
			exists
				? contacts.map((row) => (row.id === contact.id ? contact : row))
				: [...contacts, contact],
		);
		closeDialog();
	};

	return (
		<div className="space-y-4">
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="border-b border-slate-200 px-6 py-4">
					<CardTitle className="text-base font-medium text-slate-900">
						<Translate
							text={localizationConstants.orderEntreprenorSection}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="p-6">
					<div className="space-y-1 sm:max-w-[calc(50%-1rem)]">
						<Label className="text-sm font-medium text-slate-700">
							<Translate
								text={
									localizationConstants.projectCreateContractorTypeLabel
								}
							/>{" "}
							<span className="text-red-500" aria-hidden>
								*
							</span>
						</Label>
						<Controller
							control={control}
							name="organisation.contractorType"
							render={({ field }) => (
								<SearchableSelect
									value={field.value}
									onChange={field.onChange}
									options={CONTRACTOR_TYPE_OPTIONS}
									allowCustom={false}
									hasError={Boolean(typeError)}
									placeholder={t(
										localizationConstants.projectCreateContractorTypeLabel,
									)}
									searchPlaceholder={t(
										localizationConstants.search,
									)}
								/>
							)}
						/>
						{typeError && (
							<p className="text-xs font-medium text-red-500">
								{t(typeError.message as TranslationKeys)}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<OrganisationDetailsCard
				form={form}
				action={
					<Button
						type="button"
						variant="ghost"
						onClick={() => openDialog(null)}
						className="h-8 cursor-pointer gap-1.5 px-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.projectCreateChangeOrAdd}
						/>
					</Button>
				}
			/>

			<ContactPersonsTable
				contacts={contacts}
				onEdit={openDialog}
				onAdd={() => openDialog(null)}
				onChange={onContactsChange}
			/>

			<ContactPersonDialog
				isOpen={isDialogOpen}
				initialData={editing}
				onClose={closeDialog}
				onSave={saveContact}
			/>
		</div>
	);
}

export default Step4Organisation;
