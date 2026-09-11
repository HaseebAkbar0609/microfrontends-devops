"use client";

import {
	useForm,
	Controller,
	useFieldArray,
	type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	BriefcaseBusiness,
	Loader2,
	MapPin,
	Settings2,
	Contact,
	Save,
	UserPlus,
	Users,
} from "lucide-react";
import { contactSchema, ContactFormValues } from "../schemas/profile.schema";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	Form,
	FormInput,
	FormCheckbox,
	FormSelect,
	FormCitySelect,
	FormFileUpload,
} from "@/components/form";
import { showToast } from "@/lib/toast";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { getCountriesAction, type Country } from "@/api-actions";
import { formatOptions } from "@/lib/utils";
import {
	useProfileSettings,
	useUpdateProfileSettings,
	type ProfileSettingsData,
} from "../hooks/useProfileSettings";

const MAX_PROFILE_PICTURE_BYTES = 5 * 1024 * 1024; // keep in sync with tfs-backend's _MAX_IMAGE_SIZE

/** Field-level messages the backend can return on PATCH /professionals/profile/me, keyed by form field. */
type BackendFieldErrors = Record<string, string[]>;

interface ProfileSaveError {
	response?: {
		data?: {
			message?: string;
			errors?: BackendFieldErrors;
		};
	};
}

function applyBackendFieldErrors(
	form: UseFormReturn<ContactFormValues>,
	errors: BackendFieldErrors,
) {
	for (const [field, messages] of Object.entries(errors)) {
		const message = messages[0];
		if (!message) continue;
		if (field === "city_id") form.setError("cityId", { message });
		else if (field === "country_id") form.setError("countryId", { message });
		else if (field === "phone_number") form.setError("phone", { message });
		else if (field === "postal_code") form.setError("postalCode", { message });
		else if (field === "address") form.setError("streetAddress", { message });
		else if (field === "personal_id") form.setError("personalId", { message });
		else if (field === "profile_picture_media_id")
			form.setError("profilePicture", { message });
		else if (field.startsWith("next_of_kin.")) {
			// e.g. "next_of_kin.0.phone" -> "nextOfKin.0.phone"
			const path = field.replace(/^next_of_kin\./, "nextOfKin.");
			form.setError(path as never, { message });
		} else if (field in form.getValues()) {
			form.setError(field as keyof ContactFormValues, { message });
		}
	}
}

const DEFAULT_CONTACT_VALUES: ContactFormValues = {
	nextOfKin: [{ name: "", relation: "", phone: "", email: "" }],
	notifications: {
		email: false,
		sms: false,
		webPush: false,
	},
	firstName: "",
	lastName: "",
	email: "",
	countryId: "",
	cityId: "",
	personalId: "",
	phone: "",
	streetAddress: "",
	postalCode: "",
	employmentNumber: "",
	position: "",
	department: "",
	languagePreference: "",
	languageOther: "",
};

export default function ContactSection() {
	const lastSavedRef = useRef<ContactFormValues | null>(null);
	// The city id/name the profile loaded with, so FormCitySelect can show it
	// immediately (and not reset it) before its own city list has finished loading.
	const initialCityRef = useRef<{ id: string; name: string }>({ id: "", name: "" });

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: DEFAULT_CONTACT_VALUES,
	});
	const { handleSubmit, control, watch } = form;

	const profileSettingsQuery = useProfileSettings();
	const updateProfileSettings = useUpdateProfileSettings();

	const { fields, append } = useFieldArray({ control, name: "nextOfKin" });

	const [countries, setCountries] = useState<Country[]>([]);
	const countryOptions = useMemo(() => formatOptions(countries), [countries]);
	const selectedCountryId = watch("countryId");

	useEffect(() => {
		let cancelled = false;
		getCountriesAction().then((result) => {
			if (!cancelled && result.success && result.data) {
				setCountries(result.data);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	const onSubmit = async (data: ContactFormValues) => {
		try {
			await updateProfileSettings.mutateAsync(data);
			lastSavedRef.current = data;
			showToast("success", localizationConstants.profileUpdated);
		} catch (error) {
			const apiError = error as ProfileSaveError;
			const backendErrors = apiError.response?.data?.errors;
			if (backendErrors && Object.keys(backendErrors).length > 0) {
				applyBackendFieldErrors(form, backendErrors);
			}
			// The backend already returns a translated, human-readable message
			// (e.g. "That file is too large...") for every failure, including
			// field validation errors — prefer it over a one-size-fits-all toast.
			const backendMessage = apiError.response?.data?.message;
			showToast(
				"error",
				backendMessage || localizationConstants.profileUpdateFailed,
			);
		}
	};


	useEffect(() => {
		if (!profileSettingsQuery.data) return;

		const incoming = profileSettingsQuery.data as ProfileSettingsData;
		initialCityRef.current = {
			id: incoming.cityId ?? "",
			name: incoming.cityName ?? "",
		};

		const merged: ContactFormValues = {
			...DEFAULT_CONTACT_VALUES,
			...incoming,
			notifications: {
				...DEFAULT_CONTACT_VALUES.notifications,
				...incoming.notifications,
			},
			nextOfKin:
				incoming.nextOfKin && incoming.nextOfKin.length > 0
					? incoming.nextOfKin
					: DEFAULT_CONTACT_VALUES.nextOfKin,
		};

		form.reset(merged);
		lastSavedRef.current = merged;
	}, [form, profileSettingsQuery.data]);

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className=" min-h-[calc(100vh-180px)] flex flex-col gap-6"
			>
				<div className="flex max-w-5xl flex-col gap-6">
					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<Contact size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.contactDetails} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="firstName"
									label={localizationConstants.firstName}
									placeholder={localizationConstants.firstName}
									messageClassName="text-xs text-red-600 mt-1"
									required
								/>
								<FormInput
									control={control}
									name="lastName"
									label={localizationConstants.lastName}
									placeholder={localizationConstants.lastName}
									messageClassName="text-xs text-red-600 mt-1"
									required
								/>
								<FormInput
									control={control}
									name="personalId"
									label={localizationConstants.personalId}
									placeholder="ÅÅMMDD-XXXX"
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<MapPin size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.address} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="email"
									label={localizationConstants.email}
									placeholder={localizationConstants.email}
									messageClassName="text-xs text-red-600 mt-1"
									inputClassName="!bg-[#f4f4f5]"
									inputProps={{ readOnly: true }}
								/>
								<FormInput
									control={control}
									name="phone"
									label={localizationConstants.phone}
									placeholder={localizationConstants.phone}
								/>
								<FormInput
									control={control}
									name="streetAddress"
									label={localizationConstants.streetAddress}
									placeholder={localizationConstants.streetAddress}
								/>
							</div>
							<div className="grid grid-cols-3 gap-4 mt-4">
								<FormInput
									control={control}
									name="postalCode"
									label={localizationConstants.postalCode}
									placeholder={localizationConstants.postalCode}
								/>
								<FormSelect
									control={control}
									name="countryId"
									label={<Translate text={localizationConstants.profileCountry} />}
									placeholder={localizationConstants.profileCountry}
									triggerClassName="w-full"
									options={countryOptions}
								/>
								<FormCitySelect
									name="cityId"
									countryId={selectedCountryId}
									label={<Translate text={localizationConstants.profilePostalCity} />}
									placeholder={localizationConstants.profilePostalCity}
									triggerClassName="w-full"
									disabled={!selectedCountryId}
									skipCityResetWhenValue={initialCityRef.current.id}
									ensureOptionIfMissing={initialCityRef.current.id}
									ensureOptionLabelIfMissing={initialCityRef.current.name}
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<Users size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.nextOfKin} />}
						defaultOpen
					>
						<div>
							{fields.map((field, idx) => (
								<div key={field.id} className="grid grid-cols-3 gap-4 mb-4">
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.name` as const}
										label={localizationConstants.nextOfKinName}
										placeholder={localizationConstants.nextOfKinName}
									/>
									<FormSelect
										control={control}
										name={`nextOfKin.${idx}.relation` as const}
										label={<Translate text={localizationConstants.relation} />}
										placeholder={localizationConstants.relation}
										triggerClassName={`w-full`}
										options={[
											{
												value: "parent",
												label: <Translate text={localizationConstants.parent} />,
											},
											{
												value: "spouse",
												label: <Translate text={localizationConstants.spouse} />,
											},
											{
												value: "child",
												label: <Translate text={localizationConstants.child} />,
											},
											{
												value: "other",
												label: <Translate text={localizationConstants.other} />,
											},
										]}
									/>
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.phone` as const}
										label={localizationConstants.nextOfKinPhone}
										placeholder={localizationConstants.nextOfKinPhone}
									/>
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.email` as const}
										label={localizationConstants.nextOfKinEmail}
										placeholder={localizationConstants.nextOfKinEmail}
									/>
								</div>
							))}
							<div className="flex items-end">
								<Button
									type="button"
									variant="outline"
									className="border-0 w-[184px] h-10 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
									onClick={() => append({ name: "", relation: "", phone: "", email: "" })}
								>
									<UserPlus size={16} />
									<Translate text={localizationConstants.addRelatives} />
								</Button>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<BriefcaseBusiness size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.workDetails} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="employmentNumber"
									label={localizationConstants.employmentNumber}
									placeholder={localizationConstants.employmentNumber}
									inputClassName="!bg-[#f4f4f5]"
									inputProps={{ readOnly: true }}
								/>
								<FormInput
									control={control}
									name="position"
									label={localizationConstants.position}
									placeholder={localizationConstants.position}
									inputClassName="!bg-[#f4f4f5]"
									inputProps={{ readOnly: true }}
								/>
								<FormInput
									control={control}
									name="department"
									label={localizationConstants.department}
									placeholder={localizationConstants.department}
									inputClassName="!bg-[#f4f4f5]"
									inputProps={{ readOnly: true }}
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="space-y-6 px-5"
						icon={<Settings2 size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.settings} />}
						defaultOpen
					>
						<div className="space-y-6">
							<FormFileUpload
								control={control}
								name="profilePicture"
								label={<Translate text={localizationConstants.profilePicture} />}
								accept="image/png, image/jpeg, image/jpg"
								allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
								maxSizeBytes={MAX_PROFILE_PICTURE_BYTES}
								buttonLabel={<Translate text={localizationConstants.upload} />}
								placeholder={<Translate text={localizationConstants.noFileChosen} />}
								helperText={<Translate text={localizationConstants.fileTypesAllowed} />}
								invalidTypeMessage={
									<Translate text={localizationConstants.unsupportedFileType} />
								}
								tooLargeMessage={
									<Translate text={localizationConstants.fileTooLarge} />
								}
								buttonClassName="bg-slate-900 px-6 !text-white hover:bg-slate-900/90"
								showPreview
							/>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-800">
									<Translate text={localizationConstants.languagePreference} />
								</label>
								<Controller
									control={control}
									name="languagePreference"
									render={({ field }) => (
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className="grid grid-cols-3 gap-6 [--primary:var(--color-primary-black)]"
										>
											<label className="flex items-center gap-2 text-sm text-slate-800">
												<RadioGroupItem value="svenska" className="border-black" />
												<Translate text={localizationConstants.swedish} />
											</label>
											<label className="flex items-center gap-2 text-sm text-slate-800">
												<RadioGroupItem value="engelska" className="border-black" />
												<Translate text={localizationConstants.english} />
											</label>
											<div>
												<label className="flex items-center gap-2 text-sm text-slate-800">
													<RadioGroupItem value="other" className="border-black" />
													<Translate text={localizationConstants.other} />
												</label>
												{watch("languagePreference") === "other" && (
													<div className="mt-3 max-w-xs">
														<FormSelect
															control={control}
															name="languageOther"
															placeholder={localizationConstants.languagePreference}
															triggerClassName={`w-full`}
															options={[
																{
																	value: "french",
																	label: <Translate text={localizationConstants.french} />,
																},
																{
																	value: "german",
																	label: <Translate text={localizationConstants.german} />,
																},
																{
																	value: "spanish",
																	label: <Translate text={localizationConstants.spanish} />,
																},
															]}
														/>
													</div>
												)}
											</div>
										</RadioGroup>
									)}
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-800">
									<Translate text={localizationConstants.notifications} />
								</label>
								<div className="grid grid-cols-3 gap-6">
									<FormCheckbox
										control={control}
										name="notifications.email"
										label={<Translate text={localizationConstants.email} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
									<FormCheckbox
										control={control}
										name="notifications.sms"
										label={<Translate text={localizationConstants.sms} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
									<FormCheckbox
										control={control}
										name="notifications.webPush"
										label={<Translate text={localizationConstants.webPush} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
								</div>
							</div>
						</div>
					</CollapsibleSection>
				</div>
				<div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
					<div className="flex justify-end gap-4">
						<Button
							variant="outline"
							type="button"
							className="border border-slate-200 w-[204px] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
							onClick={() => {
								const lastSaved = lastSavedRef.current;
								if (lastSaved) form.reset(lastSaved);
							}}
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							disabled={updateProfileSettings.isPending}
							className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
						>
							{updateProfileSettings.isPending ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Save size={16} />
							)}
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
