"use client";

import { FormInput } from "@/components/form";
import { useAuthStatus, type User } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useEffect } from "react";
import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { PaymentDetailsFormValues } from "../types";

export function CheckoutContactSection({
  control,
}: {
  control: Control<PaymentDetailsFormValues>;
}) {
  const { user, isReady } = useAuthStatus();
  const { setValue } = useFormContext<PaymentDetailsFormValues>();

  const verifiedEmail = ((user as User | null)?.email ?? "").trim();
  const emailLocked = Boolean(verifiedEmail);

  useEffect(() => {
    if (!isReady || !verifiedEmail) return;
    setValue("email", verifiedEmail, {
      shouldValidate: true,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [isReady, verifiedEmail, setValue]);

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 [&_input]:h-11">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-primary">1.</span>
        <h2 className="text-lg font-semibold text-primary">
          <Translate
            text={
              localizationConstants.manageCartCheckoutContactInformationTitle
            }
          />
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        <Translate
          text={
            localizationConstants.manageCartCheckoutContactInformationDescription
          }
        />
      </p>
      <div className="w-full">
        <FormInput
          control={control}
          name="email"
          placeholder={localizationConstants.manageCartCheckoutEmailPlaceholder}
          type="email"
          className="w-full"
          disabled={emailLocked}
          inputProps={emailLocked ? { value: verifiedEmail } : undefined}
        />
      </div>
    </div>
  );
}
