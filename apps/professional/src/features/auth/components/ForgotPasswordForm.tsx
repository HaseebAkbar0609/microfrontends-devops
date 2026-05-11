"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FORGOT_PASSWORD_DEFAULT_VALUES } from "@/features/auth/constants";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import type { ForgotPasswordFormValues } from "@/features/auth/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type ForgotPasswordFormProps = {
  isSubmitting?: boolean;
  onSubmit: (data: ForgotPasswordFormValues) => void | Promise<void>;
};

export function ForgotPasswordForm({
  isSubmitting = false,
  onSubmit,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: FORGOT_PASSWORD_DEFAULT_VALUES,
  });

  return (
    <div className="w-full 2xl:max-w-[600px] max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-2 tracking-tight">
        <Translate text={localizationConstants.forgotPasswordTitle} />
      </h1>
      <p className="text-[13px]text-gray-700 mb-8 tracking-wide">
        <Translate text={localizationConstants.forgotPasswordSubtitle} />
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-6"
        >
          <FormInput
            control={form.control}
            name="email"
            label={localizationConstants.forgotPasswordEmailLabel}
            placeholder={localizationConstants.forgotPasswordEmailPlaceholder}
            type="email"
          />

          <div className="flex justify-center pt-2 pb-1 my-3">
            <Link
              href="/login"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              <Translate
                text={localizationConstants.forgotPasswordBackToLogin}
              />
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
                    ? localizationConstants.forgotPasswordSending
                    : localizationConstants.forgotPasswordButtonText
                }
              />
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
