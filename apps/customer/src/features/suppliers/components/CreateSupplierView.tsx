"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { CircleUserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createSupplierAPIAction } from "@/api-actions";
import { getProfessionalsSubcategoriesListAPIAction } from "@/api-actions/category/professionals-subcategories-list";
import {
  createSupplierSchema,
  type CreateSupplierValues,
} from "../schemas/createSupplierSchema";
import type { CustomerCategory } from "@/types/category";

const LABEL_CLASS = "font-sans text-[14px] font-medium text-slate-700 leading-[20px] tracking-normal";
const INPUT_HEIGHT_CLASS = "h-9 2xl:h-9 text-sm";

interface CreateSupplierViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateSupplierView({
  onBack,
  onSuccess,
}: CreateSupplierViewProps) {
  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getProfessionalsSubcategoriesListAPIAction().then((result) => {
      if (result.success && result.data) {
        setCategoryOptions(
          result.data.map((cat: CustomerCategory) => ({
            value: cat.id,
            label: cat.name,
          })),
        );
      }
    });
  }, []);

  const form = useForm<CreateSupplierValues>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      companyName: "",
      category: "",
      orgNo: "",
      email: "",
      contactFirstName: "",
      contactLastName: "",
      mobileNo: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (values: CreateSupplierValues) => {
    setSubmitting(true);
    try {
      const result = await createSupplierAPIAction(values);
      if (result.success) {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Page header */}
      <header className="px-6 pt-6 pb-2 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 h-8 w-8 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={2} />
          </button>
          <h1 className="font-sans text-2xl font-semibold text-slate-900 leading-none tracking-[-0.6px]">
            <Translate text={localizationConstants.supplierCreateTitle} />
          </h1>
        </div>
        <p className="font-sans text-sm font-normal text-slate-500 leading-5 tracking-normal pl-[44px]">
          <Translate text={localizationConstants.supplierCreateSubtitle} />
        </p>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        <Form {...form}>
          <form
            id="create-supplier-form"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Section card */}
            <div className="w-full lg:w-[80%] rounded-lg border border-slate-200 bg-white overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-2 px-5 py-4 border-b bg-white">
                <CircleUserRound className="h-5 w-5 text-slate-700 shrink-0" />
                <span className="font-sans text-[16px] font-medium text-slate-700 leading-[24px] tracking-normal">
                  <Translate
                    text={localizationConstants.supplierDetailsSection}
                  />
                </span>
              </div>

              {/* Form fields */}
              <div className="p-5 space-y-2">
                {/* Row 1: Company name + Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormInput
                    control={form.control}
                    name="companyName"
                    label={localizationConstants.companyNameLabel}
                    placeholder={localizationConstants.companyNameLabel}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                  />
                  <FormSelect
                    control={form.control}
                    name="category"
                    label={localizationConstants.categoryLabel}
                    placeholder={
                      localizationConstants.registerCategoryPlaceholder
                    }
                    options={categoryOptions}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    triggerClassName={INPUT_HEIGHT_CLASS}
                  />
                </div>

                {/* Row 2: Org number + Email */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormInput
                    control={form.control}
                    name="orgNo"
                    label={localizationConstants.orgNoLabel}
                    placeholder={localizationConstants.orgNoLabel}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                    inputProps={{
                      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const val = e.target.value.replace(/[^0-9-]/g, "");
                        form.setValue("orgNo", val, { shouldValidate: true });
                      },
                    }}
                  />
                  <FormInput
                    control={form.control}
                    name="email"
                    label={localizationConstants.emailAddressLabel}
                    placeholder={localizationConstants.emailAddressLabel}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                  />
                </div>

                {/* Row 3: Contact first name + last name */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormInput
                    control={form.control}
                    name="contactFirstName"
                    label={localizationConstants.contactFirstNameLabel}
                    placeholder={localizationConstants.contactFirstNameLabel}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                    inputProps={{
                      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const val = e.target.value.replace(/[^a-zA-ZåäöÅÄÖ\s\-']/g, "");
                        form.setValue("contactFirstName", val, { shouldValidate: true });
                      },
                    }}
                  />
                  <FormInput
                    control={form.control}
                    name="contactLastName"
                    label={localizationConstants.contactLastNameLabel}
                    placeholder={localizationConstants.contactLastNameLabel}
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                    inputProps={{
                      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const val = e.target.value.replace(/[^a-zA-ZåäöÅÄÖ\s\-']/g, "");
                        form.setValue("contactLastName", val, { shouldValidate: true });
                      },
                    }}
                  />
                </div>

                {/* Row 4: Mobile number (right column only) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="hidden lg:block" />
                  <FormInput
                    control={form.control}
                    name="mobileNo"
                    label={localizationConstants.mobileNoLabel}
                    placeholder="+46 70 123 45 67"
                    className="gap-1"
                    labelClassName={LABEL_CLASS}
                    inputClassName={INPUT_HEIGHT_CLASS}
                    inputProps={{
                      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const val = e.target.value.replace(/[^0-9+\s-()]/g, "");
                        form.setValue("mobileNo", val, { shouldValidate: true });
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </main>

      {/* Sticky footer */}
      <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-[120px] border-slate-200 text-slate-600 h-10 bg-transparent hover:bg-slate-100"
            onClick={onBack}
          >
            <Translate text={localizationConstants.cancel} />
          </Button>
          <Button
            type="submit"
            form="create-supplier-form"
            disabled={submitting}
            className="min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
          >
            <Save className="h-4 w-4" />
            <Translate text={localizationConstants.save} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
