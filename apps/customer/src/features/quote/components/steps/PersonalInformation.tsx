import { UseFormReturn } from "react-hook-form";
import { CircleUserRound } from "lucide-react";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormCitySelect } from "@/components/form";
import { FormInput } from "@/components/form/FormInput";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CreateOfferFormValues } from "../../types/form";
import { useAuthStatus } from "@/context/AuthContext";

interface Step1Props {
	form: UseFormReturn<CreateOfferFormValues>;
	countryId?: string;
}

export function Step1PersonalInformation({
	form,
	countryId: propCountryId,
}: Step1Props) {
	const { user } = useAuthStatus();
	// Use user's country from profile as fallback
	const countryId = propCountryId || user?.user_profile?.country;
	const userCityId = user?.user_profile?.city;
	const formCityId = form.watch("city");
	const personalCityName = form.watch("personalCityName");

	useEffect(() => {
		if (user) {
			form.setValue("firstName", user.first_name || "");
			form.setValue("lastName", user.last_name || "");
			form.setValue("personalEmail", user.email || "");
			form.setValue(
				"mobileNumber",
				user.user_profile?.phone_number || "",
			);
			form.setValue("address", user.user_profile?.address || "");
			// FormCitySelect only fetches once it has a countryId — without this,
			// "country" stays at its "" default forever and the city dropdown
			// silently shows "No results found" even though "city" above holds
			// a valid saved id.
			form.setValue("country", user.user_profile?.country || "");
			form.setValue("city", user.user_profile?.city || "");
			form.setValue("pincode", user.user_profile?.postal_code || "");
		}
	}, [user, form]);

	return (
		<Card className="border shadow-sm overflow-hidden bg-white py-0 gap-0">
			<CardHeader className="bg-slate-50/50 px-5 py-4 border-b !pb-0 ">
				<div className="flex items-center gap-2">
					<CircleUserRound className="h-5 w-5 text-slate-700" />
					<CardTitle className="text-base font-semibold">
						<Translate
							text={
								localizationConstants.personalInformationSection
							}
						/>
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<div className="grid gap-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="firstName"
							label={localizationConstants.firstNameLabel}
							placeholder={localizationConstants.firstNameLabel}
						/>
						<FormInput
							control={form.control}
							name="lastName"
							label={localizationConstants.lastNameLabel}
							placeholder={localizationConstants.lastNameLabel}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="mobileNumber"
							label={localizationConstants.mobileNumberLabel}
							placeholder={
								localizationConstants.mobileNumberLabel
							}
						/>
						<FormInput
							control={form.control}
							name="personalEmail"
							label={localizationConstants.personalEmailLabel}
							placeholder={
								localizationConstants.personalEmailLabel
							}
							type="email"
						/>
					</div>

					<FormInput
						control={form.control}
						name="address"
						label={localizationConstants.addressLabel}
						placeholder={localizationConstants.addressLabel}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormCitySelect<CreateOfferFormValues, "city">
							name="city"
							countryId={countryId}
							label={localizationConstants.cityLabel}
							placeholder={localizationConstants.cityLabel}
							skipCityResetWhenValue={userCityId}
							ensureOptionIfMissing={formCityId || userCityId}
							ensureOptionLabelIfMissing={
								personalCityName?.trim() || undefined
							}
							syncLabelToField="personalCityName"
							triggerClassName="w-full"
						/>
						<FormInput
							control={form.control}
							name="pincode"
							label={localizationConstants.postalcode}
							placeholder={localizationConstants.postalcode}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
