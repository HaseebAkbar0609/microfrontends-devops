"use client";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetFooter,
} from "@/components/ui/sheet";
import { FormSelect, type FormSelectOption } from "@/components/form";
import { Loader2 } from "lucide-react";

const newInvitationSchema = z.object({
	companyName: z
		.string()
		.min(1, localizationConstants.validationRegisterCompanyNameRequired),
	/** Professional subcategory id (option value). */
	category: z
		.string()
		.min(1, localizationConstants.validationRegisterCategoryRequired),
	orgNumber: z
		.string()
		.min(
			1,
			localizationConstants.validationRegisterOrganisationNumberRequired,
		),
	contactFirstName: z
		.string()
		.min(
			1,
			localizationConstants.validationRegisterContactFirstNameRequired,
		),
	contactLastName: z
		.string()
		.min(
			1,
			localizationConstants.validationRegisterContactLastNameRequired,
		),
	emailAddress: z
		.string()
		.min(1, localizationConstants.validationRegisterEmailRequired)
		.email(localizationConstants.validationRegisterEmailInvalid),
	mobileNumber: z
		.string()
		.min(1, localizationConstants.validationRegisterPhoneRequired),
});

export type NewInvitationFormValues = z.infer<typeof newInvitationSchema>;

const DEFAULT_NEW_INVITATION_VALUES: NewInvitationFormValues = {
	companyName: "",
	category: "",
	orgNumber: "",
	contactFirstName: "",
	contactLastName: "",
	emailAddress: "",
	mobileNumber: "",
};

interface NewInvitationFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (values: NewInvitationFormValues) => Promise<boolean>;
	/** Professional subcategories from getProfessionalsSubcategoriesListAPIAction (CreateOfferPage). */
	categoryOptions: FormSelectOption[];
	categoriesLoading?: boolean;
}

export function NewInvitationForm({
	open,
	onOpenChange,
	onSave,
	categoryOptions,
	categoriesLoading = false,
}: NewInvitationFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<NewInvitationFormValues>({
		resolver: zodResolver(newInvitationSchema),
		defaultValues: DEFAULT_NEW_INVITATION_VALUES,
	});

	const onSubmit = async (values: NewInvitationFormValues) => {
		setIsSubmitting(true);
		const success = await onSave(values);
		setIsSubmitting(false);
		if (success) {
			onOpenChange(false);
			form.reset();
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="!w-[450px] max-w-[450px] sm:!w-[450px] sm:max-w-[450px] p-0 flex flex-col gap-0 border-l border-slate-200 shadow-xl overflow-y-auto bg-white">
				<SheetHeader className="px-6 py-4 border-b">
					<div className="flex items-center justify-between">
						<SheetTitle className="text-xl font-bold text-slate-900 border-none outline-none">
							<Translate
								text={localizationConstants.newInvitationTitle}
							/>
						</SheetTitle>
					</div>
				</SheetHeader>

				<div className="flex-1 px-6 py-6 overflow-y-auto">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-2"
						>
							<FormInput
								control={form.control}
								name="companyName"
								label={localizationConstants.companyNameLabel}
								placeholder={
									localizationConstants.companyNameLabel
								}
							/>
							<FormSelect
								control={form.control}
								name="category"
								label={localizationConstants.categoryLabel}
								placeholder={
									localizationConstants.categoryLabel
								}
								options={categoryOptions}
								disabled={categoriesLoading}
								triggerClassName="w-full"
							/>
							<FormInput
								control={form.control}
								name="orgNumber"
								label={
									localizationConstants.organizationNumberLabel
								}
								placeholder={localizationConstants.orgNoLabel}
							/>
							<FormInput
								control={form.control}
								name="contactFirstName"
								label={
									localizationConstants.contactFirstNameLabel
								}
								placeholder={
									localizationConstants.contactFirstNameLabel
								}
							/>
							<FormInput
								control={form.control}
								name="contactLastName"
								label={
									localizationConstants.contactLastNameLabel
								}
								placeholder={
									localizationConstants.contactLastNameLabel
								}
							/>
							<FormInput
								control={form.control}
								name="emailAddress"
								label={localizationConstants.emailAddressLabel}
								placeholder={localizationConstants.emailLabel}
								type="email"
							/>
							<FormInput
								control={form.control}
								name="mobileNumber"
								label={localizationConstants.mobileNoLabel}
								placeholder="+46 70 123 45 67"
							/>
						</form>
					</Form>
				</div>

				<SheetFooter className="px-6 py-4 border-t flex flex-row w-full bg-white">
					<Button
						type="button"
						variant="outline"
						className="w-1/2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
						onClick={() => onOpenChange(false)}
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="submit"
						className="w-1/2 bg-slate-900 text-white hover:bg-slate-800"
						onClick={form.handleSubmit(onSubmit)}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						<Translate text={localizationConstants.save} />
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
