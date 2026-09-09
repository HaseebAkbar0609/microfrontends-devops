"use client";

import { FormInput, FormSelect, FormCitySelect } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { PaymentDetailsFormValues } from "../types";

export function CheckoutBillingSection({
  control,
  countryOptions,
}: {
  control: Control<PaymentDetailsFormValues>;
  countryOptions: { value: string; label: string }[];
}) {
  const selectedCountry = useWatch({
    control,
    name: "country",
  });

  return (
    <div className="min-w-0 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 [&_input]:h-11 [&_[role=combobox]]:min-h-11">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-primary">2.</span>
          <h2 className="text-lg font-semibold text-primary">
            <Translate
              text={localizationConstants.manageCartCheckoutBillingAddressTitle}
            />
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <Translate
            text={
              localizationConstants.manageCartCheckoutBillingAddressDescription
            }
          />
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          control={control}
          name="firstName"
          placeholder={
            localizationConstants.manageCartCheckoutFirstNamePlaceholder
          }
          className="w-full"
        />
        <FormInput
          control={control}
          name="lastName"
          placeholder={
            localizationConstants.manageCartCheckoutLastNamePlaceholder
          }
          className="w-full"
        />
      </div>

      <FormInput
        control={control}
        name="address"
        placeholder={localizationConstants.manageCartCheckoutAddressPlaceholder}
        className="w-full"
      />

      <FormInput
        control={control}
        name="address2"
        placeholder={
          localizationConstants.manageCartCheckoutAddress2Placeholder
        }
        className="w-full"
      />
      <FormSelect
        control={control}
        name="country"
        placeholder={localizationConstants.manageCartCheckoutCountryPlaceholder}
        options={countryOptions}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormCitySelect
          name="city"
          placeholder={localizationConstants.manageCartCheckoutCityPlaceholder}
          className="w-full"
          countryId={selectedCountry}
          disabled={!selectedCountry}
        />
        <FormInput
          control={control}
          name="postalCode"
          placeholder={
            localizationConstants.manageCartCheckoutPostalCodePlaceholder
          }
          className="w-full"
        />
      </div>

      <div className="max-w-[520px]">
        <FormInput
          control={control}
          name="phone"
          placeholder={localizationConstants.manageCartCheckoutPhonePlaceholder}
          className="w-full"
        />
      </div>
    </div>
  );
}
