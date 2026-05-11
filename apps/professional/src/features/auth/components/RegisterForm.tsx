"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";

import { Form, FormCheckbox, FormInput, FormSelect, FormCategorySelect, FormCitySelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { REGISTER_DEFAULT_VALUES } from "@/features/auth/constants/register";
import { registerSchema } from "@/features/auth/schemas";
import type { RegisterFormValues } from "@/features/auth/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getCountriesAction,
  type Country,
} from "@/api-actions";
import { formatOptions } from "@/lib/utils";

export type RegisterFormProps = {
  isSubmitting?: boolean;
  onSubmit: (data: RegisterFormValues) => void | Promise<void>;
};

export function RegisterForm({
  isSubmitting = false,
  onSubmit,
}: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
  });

  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";
  const prefillPhone = searchParams.get("phone") || "";

  useEffect(() => {
    if (prefillEmail) {
      form.setValue("email", decodeURIComponent(prefillEmail));
    }
    if (prefillPhone) {
      form.setValue("phone", decodeURIComponent(prefillPhone));
    }
  }, [prefillEmail, prefillPhone, form]);

  const [countries, setCountries] = useState<Country[]>([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);

  const selectedCountry = useWatch({
    control: form.control,
    name: "country",
  });

  const countryOptions = useMemo(() => formatOptions(countries), [countries]);

  useEffect(() => {
    const loadCountries = async () => {
      setIsCountriesLoading(true);
      try {
        const result = await getCountriesAction();
        if (!result.success || !result.data) {
          setCountries([]);
          return;
        }
        setCountries(result.data);
      } finally {
        setIsCountriesLoading(false);
      }
    };
    loadCountries();
  }, []);

  const handleSubmit = async (data: RegisterFormValues) => {
    await onSubmit(data);
  };

  return (
    <div className="w-full 2xl:max-w-[600px] max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-700 mb-2">
        <Translate text={localizationConstants.registerWelcomeTitle} />
      </h1>
      <p className="text-[13px] text-gray-700 mb-8 ">
        <Translate text={localizationConstants.registerWelcomeSubtitle} />
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 bg-white p-6 rounded-lg"
        >
          <FormInput
            control={form.control}
            name="companyName"
            label={localizationConstants.registerCompanyNameLabel}
            placeholder={localizationConstants.registerCompanyNamePlaceholder}
            className="w-full items-start self-start"
          />

          <FormCategorySelect
            name="category"
            className="w-full items-start self-start"
            label={
              <Translate text={localizationConstants.registerCategoryLabel} />
            }
            placeholder={localizationConstants.registerCategoryPlaceholder}
          />

          <FormInput
            control={form.control}
            name="organisationNumber"
            label={localizationConstants.registerOrganisationNumberLabel}
            placeholder={
              localizationConstants.registerOrganisationNumberPlaceholder
            }
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="contactFirstName"
            label={localizationConstants.registerContactFirstNameLabel}
            placeholder={
              localizationConstants.registerContactFirstNamePlaceholder
            }
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="contactLastName"
            label={localizationConstants.registerContactLastNameLabel}
            placeholder={
              localizationConstants.registerContactLastNamePlaceholder
            }
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="email"
            label={localizationConstants.registerEmailLabel}
            placeholder={localizationConstants.registerEmailPlaceholder}
            type="email"
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="phone"
            label={localizationConstants.registerPhoneLabel}
            placeholder={localizationConstants.registerPhonePlaceholder}
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="postalCode"
            label={localizationConstants.registerPostalCodeLabel}
            placeholder={localizationConstants.registerPostalCodePlaceholder}
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="address"
            label={localizationConstants.registerAddressLabel}
            placeholder={localizationConstants.registerAddressPlaceholder}
            className="w-full items-start self-start"
          />

          <FormSelect
            control={form.control}
            name="country"
            label={
              <Translate text={localizationConstants.registerCountryLabel} />
            }
            placeholder={localizationConstants.registerCountryPlaceholder}
            options={countryOptions}
            disabled={isCountriesLoading}
            className="w-full items-start self-start"
          />

          <FormCitySelect
            name="city"
            countryId={selectedCountry as string}
            label={<Translate text={localizationConstants.registerCityLabel} />}
            placeholder={localizationConstants.registerCityPlaceholder}
            disabled={!selectedCountry}
            className="w-full items-start self-start"
            triggerClassName="w-full 2xl:h-12 h-10"
          />

          <FormInput
            control={form.control}
            name="password"
            label={localizationConstants.registerPasswordLabel}
            placeholder={localizationConstants.registerPasswordPlaceholder}
            type="password"
            className="w-full items-start self-start"
          />

          <FormInput
            control={form.control}
            name="confirmPassword"
            label={localizationConstants.registerConfirmPasswordLabel}
            placeholder={
              localizationConstants.registerConfirmPasswordPlaceholder
            }
            type="password"
            className="w-full items-start self-start"
          />

          <div className="col-span-1 md:col-span-2 space-y-2">
            <p className="text-[13px] text-gray-500 tracking-wide">
              <Translate text={localizationConstants.registerTermsLabel} />
            </p>
            <FormCheckbox
              control={form.control}
              name="acceptTerms"
              label={
                <Translate
                  text={localizationConstants.registerTermsMustAccept}
                />
              }
              className="w-full items-start self-start"
            />
          </div>

          <div className="col-span-1 md:col-span-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" aria-hidden />
                <Translate
                  text={
                    isSubmitting
                      ? localizationConstants.registerSubmitting
                      : localizationConstants.registerCheckoutButton
                  }
                />
              </span>
            </Button>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2 pt-4">
            <Link
              href="/register"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              <Translate
                text={localizationConstants.registerChangeRegistrationType}
              />
            </Link>
            <Link
              href="/login"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              <Translate text={localizationConstants.registerWantToLogin} />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
