"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { OTP_DEFAULT_VALUES } from "@/features/auth/constants";
import { otpSchema } from "@/features/auth/schemas";
import type { AuthScreenType, OtpFormValues } from "@/features/auth/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type OtpScreenProps = {
  type: AuthScreenType;
  isSubmitting?: boolean;
  onSubmit: (data: OtpFormValues) => void | Promise<void>;
};

export function OtpScreen({
  type,
  isSubmitting = false,
  onSubmit,
}: OtpScreenProps) {
  // type is intentionally part of the API so this screen can be reused
  // for other auth flows that share the OTP UI.
  void type;

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: OTP_DEFAULT_VALUES,
  });

  return (
    <div className="w-full 2xl:max-w-[600px] max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-2 tracking-tight">
        <Translate text={localizationConstants.otpTitle} />
      </h1>
      <p className="text-[13px]text-gray-700 mb-8 tracking-wide">
        <Translate text={localizationConstants.otpSubtitle} />
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-6"
        >
          <FormInput
            control={form.control}
            name="otp"
            label={localizationConstants.otpLabel}
            placeholder={localizationConstants.otpPlaceholder}
            type="text"
            inputProps={{
              inputMode: "numeric",
              autoComplete: "one-time-code",
              maxLength: 6,
            }}
          />

          <div className="flex justify-center pt-2 pb-1 my-3">
            <Link
              href="/login"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              <Translate text={localizationConstants.otpBackToLogin} />
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" aria-hidden />
              <Translate
                text={
                  isSubmitting
                    ? localizationConstants.otpVerifying
                    : localizationConstants.otpButtonText
                }
              />
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
