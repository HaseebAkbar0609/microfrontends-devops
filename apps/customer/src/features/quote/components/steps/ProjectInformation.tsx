import { UseFormReturn } from "react-hook-form";
import { HardHat } from "lucide-react";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormCitySelect } from "@/components/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { FormSelectOption } from "@/components/form";
import { CreateOfferFormValues } from "../../types/form";
import { useAuthStatus } from "@/context/AuthContext";

interface Step2Props {
	form: UseFormReturn<CreateOfferFormValues>;
	countryId?: string;
	categoryOptions: FormSelectOption[];
	categoriesLoading: boolean;
	categoryHasMore?: boolean;
	categoryLoadingMore?: boolean;
	onCategoryLoadMore?: () => void | Promise<void>;
	onCategorySearchChange?: (query: string) => void | Promise<void>;
}

const expressJobOption =
	"h-4 w-4 rounded-full border flex items-center justify-center shrink-0";

export function Step2ProjectInformation({
	form,
	countryId: propCountryId,
	categoryOptions,
	categoriesLoading,
	categoryHasMore = false,
	categoryLoadingMore = false,
	onCategoryLoadMore,
	onCategorySearchChange,
}: Step2Props) {
	const { user } = useAuthStatus();
	const isExpressJob = form.watch("isExpressJob");
	const sameAsContact = form.watch("sameAsContact");
	const formProjectCityId = form.watch("projectCity");
	const projectCityName = form.watch("projectCityName");
	const personalAddress = form.watch("address");
	const personalCity = form.watch("city");
	const personalPin = form.watch("pincode");
	const personalCityName = form.watch("personalCityName");
	const profile = user?.user_profile;
	// Same pattern as PersonalInformation: form country with profile fallback
	const countryId = propCountryId || user?.user_profile?.country;
	const userCityId = user?.user_profile?.city;

	useEffect(() => {
		if (!sameAsContact) return;

		const addr =
			personalAddress?.trim() || profile?.address?.trim() || "";
		const cityId =
			personalCity?.trim() || profile?.city?.trim() || "";
		const postal =
			personalPin?.trim() || profile?.postal_code?.trim() || "";

		const opts = {
			shouldValidate: true,
			shouldDirty: true,
		} as const;

		form.setValue("projectAddress", addr, opts);
		form.setValue("projectCity", cityId, opts);
		form.setValue("projectPostalCode", postal, opts);

		form.setValue(
			"projectCityName",
			personalCityName?.trim() ?? "",
			opts,
		);
	}, [
		sameAsContact,
		profile,
		personalAddress,
		personalCity,
		personalPin,
		personalCityName,
		form,
	]);

	return (
		<Card className="border shadow-sm overflow-hidden bg-white py-0 gap-0">
			<CardHeader className="bg-slate-50/50 px-5 py-4 border-b !pb-0">
				<div className="flex items-center gap-2">
					<HardHat className="h-5 w-5 text-slate-700" />
					<CardTitle className="text-base font-semibold">
						<Translate
							text={
								localizationConstants.projectInformationSection
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
							name="projectName"
							label={localizationConstants.projectNameLabel}
							placeholder={localizationConstants.projectNameLabel}
						/>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-medium text-slate-700">
								<Translate
									text={localizationConstants.offerTypeLabel}
								/>
							</span>
							<div className="flex items-center gap-4 py-2">
								<button
									type="button"
									className="flex items-center gap-2 cursor-pointer text-left"
									onClick={() =>
										form.setValue("isExpressJob", "b2c")
									}
								>
									<div
										className={`${expressJobOption} ${isExpressJob === "b2c" ? "border-slate-900" : "border-slate-300"}`}
									>
										{isExpressJob === "b2c" && (
											<div className="h-2 w-2 rounded-full bg-slate-900" />
										)}
									</div>
									<span className="text-sm">
										<Translate
											text={
												localizationConstants.offerB2C
											}
										/>
									</span>
								</button>
								<button
									type="button"
									className="flex items-center gap-2 cursor-pointer text-left"
									onClick={() =>
										form.setValue("isExpressJob", "express")
									}
								>
									<div
										className={`${expressJobOption} ${isExpressJob === "express" ? "border-slate-900" : "border-slate-300"}`}
									>
										{isExpressJob === "express" && (
											<div className="h-2 w-2 rounded-full bg-slate-900" />
										)}
									</div>
									<span className="text-sm">
										<Translate
											text={
												localizationConstants.offerExpress
											}
										/>
									</span>
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="clientNo"
							label={localizationConstants.clientNoLabel}
							optional
							placeholder={localizationConstants.clientNoLabel}
						/>
						<FormSelect
							control={form.control}
							name="category"
							label={localizationConstants.categoryLabel}
							placeholder={localizationConstants.categoryLabel}
							options={categoryOptions}
							disabled={categoriesLoading}
							multiple
							searchable
							onSearchChange={onCategorySearchChange}
							hasMore={categoryHasMore}
							isLoadingMore={categoryLoadingMore}
							onLoadMore={onCategoryLoadMore}
							triggerClassName="w-full "
						/>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="sameAsContact"
							{...form.register("sameAsContact")}
							className="h-4 w-4 rounded border-slate-300"
						/>
						<label
							htmlFor="sameAsContact"
							className="text-sm text-slate-600 cursor-pointer"
						>
							<Translate
								text={localizationConstants.sameAsContactLabel}
							/>
						</label>
					</div>

					<FormInput
						control={form.control}
						name="projectAddress"
						label={localizationConstants.projectAddressLabel}
						placeholder={localizationConstants.projectAddressLabel}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormCitySelect<CreateOfferFormValues, "projectCity">
							name="projectCity"
							countryId={countryId}
							label={localizationConstants.projectCityLabel}
							placeholder={localizationConstants.projectCityLabel}
							skipCityResetWhenValue={userCityId}
							ensureOptionIfMissing={
								formProjectCityId || userCityId
							}
							ensureOptionLabelIfMissing={
								projectCityName?.trim() || undefined
							}
							syncLabelToField="projectCityName"
							triggerClassName="w-full"
						/>
						<FormInput
							control={form.control}
							name="projectPostalCode"
							label={localizationConstants.projectPostalCodeLabel}
							placeholder={
								localizationConstants.projectPostalCodeLabel
							}
						/>
					</div>

					<FormInput
						control={form.control}
						name="directions"
						label={localizationConstants.directionsLabel}
						optional
						placeholder={localizationConstants.directionsLabel}
						type="textarea"
						rows={4}
						cols={50}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
