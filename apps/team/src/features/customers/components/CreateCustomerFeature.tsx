"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CircleUserRound, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createPrivateCustomerAPIAction } from "@/api-actions";

const SWEDISH_CITIES = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
  "Lund",
  "Umeå",
  "Solna",
  "Gävle",
  "Borås",
  "Södertälje",
  "Eskilstuna",
  "Halmstad",
  "Växjö",
  "Karlstad",
].map((city) => ({ value: city, label: city }));

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  personalNumber: z.string(),
  privateEmail: z.string().refine((v) => !v || z.string().email().safeParse(v).success, {
    message: "Invalid email address",
  }),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateCustomerFeature() {
  const router = useRouter();
  const t = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      personalNumber: "",
      privateEmail: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createPrivateCustomerAPIAction(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(t(localizationConstants.customerCreatedSuccess));
      router.push("/customers/private");
    } else {
      toast.error(result.error ?? t(localizationConstants.customerCreateError));
    }
  }

  function handleCancel() {
    router.push("/customers/private");
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Page header */}
      <div className="flex items-center gap-3 px-6 py-5">
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            <Translate text={localizationConstants.createCustomerTitle} />
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            <Translate text={localizationConstants.createCustomerSubtitle} />
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <div className="flex-1 px-6 pb-6">
            <div className="rounded-lg border border-zinc-200 bg-white">
              <CollapsibleSection
                icon={<CircleUserRound className="h-4 w-4 text-slate-700" />}
                title={
                  <Translate text={localizationConstants.customerDetailsSection} />
                }
                defaultOpen
                headerClassName="px-4 py-4 mb-0"
                contentClassName="p-4"
              >
                <div className="flex flex-col gap-4">
                  {/* Row 1: First name + Last name */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                      control={form.control}
                      name="firstName"
                      label={localizationConstants.firstNameLabel}
                      placeholder="Johan"
                      className="grid gap-1"
                    />
                    <FormInput
                      control={form.control}
                      name="lastName"
                      label={localizationConstants.lastNameLabel}
                      placeholder="Andersson"
                      className="grid gap-1"
                    />
                  </div>

                  {/* Row 2: Personal number + Private email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                      control={form.control}
                      name="personalNumber"
                      label={localizationConstants.personalNumberLabel}
                      placeholder="1985-05-05-1010"
                      className="grid gap-1"
                    />
                    <FormInput
                      control={form.control}
                      name="privateEmail"
                      label={localizationConstants.privateEmailLabel}
                      placeholder="johan@gmail.com"
                      type="email"
                      className="grid gap-1"
                    />
                  </div>

                  {/* Row 3: Address (full width) */}
                  <FormInput
                    control={form.control}
                    name="address"
                    label={localizationConstants.addressLabel}
                    placeholder="Stengatan 10"
                    className="grid gap-1"
                  />

                  {/* Row 4: City + Postal code */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormSelect
                      control={form.control}
                      name="city"
                      label={<Translate text={localizationConstants.ortLabel} />}
                      placeholder="Välj ort"
                      options={SWEDISH_CITIES}
                      className="grid gap-1"
                    />
                    <FormInput
                      control={form.control}
                      name="postalCode"
                      label={localizationConstants.postNrLabel}
                      placeholder="171 63"
                      className="grid gap-1"
                    />
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-40"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <Translate text={localizationConstants.cancelLabel} />
            </Button>
            <Button
              type="submit"
              size="lg"
              className="w-40 bg-zinc-900 hover:bg-zinc-800"
              disabled={isSubmitting}
            >
              <Translate text={localizationConstants.save} />
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
