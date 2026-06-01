"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormInput, FormFileUpload, FormCheckbox } from "@/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { createUserProfileSchema, UserProfileFormValues } from "../schemas/userProfile.schema";
import { DEFAULT_USER_PERMISSIONS, USER_PERMISSION_OPTIONS } from "../constants";

import type { User } from "../types/types";
import { maskPersonalNumber } from "../utils/userFormatters";

type Props = {
	mode: "create" | "edit";
	user: User | null;
	readOnly: boolean;
	isOwnProfile: boolean;
	onCancel: () => void;
	onSaved: () => void;
};

export function UserProfileForm({
	mode,
	user,
	readOnly,
	isOwnProfile,
	onCancel,
	onSaved,
}: Props) {
	const { t } = useTranslation();
	const isEdit = mode === "edit";
	const [isSaved, setIsSaved] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const userProfileSchema = useMemo(
		() =>
			createUserProfileSchema({
				firstNameRequired: t(localizationConstants.validationUserFirstNameRequired),
				lastNameRequired: t(localizationConstants.validationUserLastNameRequired),
				mobileNumberRequired: t(localizationConstants.validationUserMobileNumberRequired),
				privateEmailInvalid: t(localizationConstants.validationUserPrivateEmailInvalid),
				addressRequired: t(localizationConstants.validationUserAddressRequired),
				cityRequired: t(localizationConstants.validationUserCityRequired),
				postalCodeRequired: t(localizationConstants.validationUserPostalCodeRequired),
				personalNumberFormat: t(localizationConstants.validationUserPersonalNumberFormat),
			}),
		[t],
	);

	const form = useForm<UserProfileFormValues>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: user?.first_name ?? "",
			last_name: user?.last_name ?? "",
			mobile_number: user?.mobile_number ?? "",
			private_email: user?.private_email ?? "",
			address: user?.address ?? "",
			city: user?.city ?? "",
			postal_code: user?.postal_code ?? "",
			personal_number: user?.personal_number ?? "",
			profile_photo: null,
			permissions: user?.permissions ?? DEFAULT_USER_PERMISSIONS,
		},
	});

	const onSubmit = async (values: UserProfileFormValues) => {
		const payload = {
			...values,
			personal_number: isEdit && user ? user.personal_number : values.personal_number,
		};

		// API integration pending backend endpoint; save is mocked intentionally.
		console.log("Mock save user", payload);
		setIsSaved(true);
		onSaved();
	};

	const personalNumberValue = form.watch("personal_number");
	const shouldMaskPersonalNumber = isEdit || isSaved;
	const compactFieldClassName = "gap-1.5";
	const compactInputProps = {
		labelClassName: "text-sm font-medium leading-none",
		inputClassName: "h-10 text-sm",
		messageClassName: "text-xs",
	} as const;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-md">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
					<div className="border-b border-slate-200 px-5 pt-2">
						<TabsList variant="line">
							<TabsTrigger value="profile">{t(localizationConstants.userFormProfileTab)}</TabsTrigger>
							<TabsTrigger value="permissions">{t(localizationConstants.userFormPermissionsTab)}</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="profile" className="px-5 py-3">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 max-w-5xl">
							<FormInput control={form.control} name="first_name" label={t(localizationConstants.userFormFirstNameLabel)} placeholder={t(localizationConstants.userFormFirstNamePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
							<FormInput control={form.control} name="last_name" label={t(localizationConstants.userFormLastNameLabel)} placeholder={t(localizationConstants.userFormLastNamePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
							<FormInput control={form.control} name="mobile_number" label={t(localizationConstants.userFormMobileNumberLabel)} placeholder={t(localizationConstants.userFormMobileNumberPlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
							<FormInput control={form.control} name="private_email" label={t(localizationConstants.userFormPrivateEmailLabel)} placeholder={t(localizationConstants.userFormPrivateEmailPlaceholder)} type="email" disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
							<FormInput control={form.control} name="address" label={t(localizationConstants.userFormAddressLabel)} placeholder={t(localizationConstants.userFormAddressPlaceholder)} disabled={readOnly} className={`md:col-span-2 ${compactFieldClassName}`} {...compactInputProps} />
							<FormInput control={form.control} name="city" label={t(localizationConstants.userFormCityLabel)} placeholder={t(localizationConstants.userFormCityPlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
							<FormInput control={form.control} name="postal_code" label={t(localizationConstants.userFormPostalCodeLabel)} placeholder={t(localizationConstants.userFormPostalCodePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />

							<FormInput
								control={form.control}
								name="personal_number"
								label={t(localizationConstants.userFormPersonalNumberLabel)}
								placeholder={t(localizationConstants.userFormPersonalNumberPlaceholder)}
								disabled={readOnly || shouldMaskPersonalNumber}
								className={compactFieldClassName}
								{...compactInputProps}
								inputProps={{
									value: shouldMaskPersonalNumber ? maskPersonalNumber(personalNumberValue) : personalNumberValue,
									onChange: shouldMaskPersonalNumber ? undefined : form.register("personal_number").onChange,
								}}
							/>

							{!readOnly && (
								<FormFileUpload
									control={form.control}
									name="profile_photo"
									label={t(localizationConstants.userFormUploadPhotoLabel)}
									buttonLabel={t(localizationConstants.upload)}
									placeholder={t(localizationConstants.noFileChosen)}
									allowedTypes={["image/png", "image/jpeg"]}
									showPreview
									className={`md:col-span-2 ${compactFieldClassName}`}
									labelClassName={compactInputProps.labelClassName}
									inputWrapperClassName="max-w-5xl"
									inputClassName="h-10 rounded-md px-4 py-2 text-sm"
									buttonClassName="h-10 px-4"
									messageClassName="text-xs"
								/>
							)}
						</div>
					</TabsContent>

					<TabsContent value="permissions" className="p-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
							{USER_PERMISSION_OPTIONS.map((permission) => (
								<FormCheckbox
									key={permission.key}
									control={form.control}
									name={`permissions.${permission.key}`}
									label={<Translate text={permission.label} />}
									disabled={readOnly}
								/>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
					<div>
						{isEdit && !isOwnProfile && !readOnly && (
							<Button
								type="button"
								variant="destructive"
								className="gap-2"
								onClick={() => {
									// API integration pending backend endpoint; delete is mocked intentionally.
									console.log("Mock delete user", user?.id);
									onSaved();
								}}
							>
								<Trash2 className="h-4 w-4" />
								{t(localizationConstants.userFormDeleteButton)}
							</Button>
						)}
					</div>

					<div className="flex items-center gap-3">
						<Button type="button" variant="outline" onClick={onCancel}>
							{t(localizationConstants.userFormCancelButton)}
						</Button>

						{!readOnly && (
							<Button type="submit" className="gap-2">
								<Save className="h-4 w-4" />
								{t(localizationConstants.userFormSaveButton)}
							</Button>
						)}

						{!readOnly && activeTab === "profile" && (
							<Button
								type="button"
								className="gap-2"
								onClick={() => setActiveTab("permissions")}
							>
								{t(localizationConstants.userFormNextButton)}
								<ArrowRight className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}
