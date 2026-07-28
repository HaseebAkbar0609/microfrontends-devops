"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, CircleUserRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  getSupplierByIdForEditAPIAction,
  updateSupplierAPIAction,
} from "@/api-actions";
import { getProfessionalsSubcategoriesListAPIAction } from "@/api-actions/category/professionals-subcategories-list";
import {
  createSupplierSchema,
  type CreateSupplierValues,
} from "../schemas/createSupplierSchema";
import type { CustomerCategory } from "@/types/category";

const LABEL_CLASS =
  "font-sans text-[14px] font-medium text-slate-700 leading-[20px] tracking-normal";
const INPUT_HEIGHT_CLASS = "h-9 2xl:h-9 text-sm";

interface EditSupplierViewProps {
  supplierId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function EditSupplierView({
  supplierId,
  onBack,
  onSuccess,
}: EditSupplierViewProps) {
  const t = useTranslate();
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

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

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoadingData(true);
      setLoadError(null);

      // Load subcategories
      const catRes = await getProfessionalsSubcategoriesListAPIAction();
      let opts: { value: string; label: string }[] = [];
      if (!isCancelled && catRes.success && catRes.data) {
        opts = catRes.data.map((cat: CustomerCategory) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategoryOptions(opts);
      }

      // Load supplier detail for editing
      const supplierRes = await getSupplierByIdForEditAPIAction(supplierId);
      if (!isCancelled) {
        if (supplierRes.success && supplierRes.data) {
          const s = supplierRes.data;
          const rawCat = (s.category || "").trim();
          const matchedOpt = opts.find(
            (o) =>
              o.value === rawCat ||
              o.label.toLowerCase() === rawCat.toLowerCase(),
          );
          const finalCategory = matchedOpt ? matchedOpt.value : rawCat;

          form.reset({
            companyName: (s.companyName || "").replace(/[<>]/g, ""),
            category: finalCategory,
            orgNo: s.orgNo || "",
            email: s.email || "",
            contactFirstName: s.contactFirstName || "",
            contactLastName: s.contactLastName || "",
            mobileNo: s.mobileNo || "",
          });
        } else {
          setLoadError(
            supplierRes.error || t(localizationConstants.errorDetailsDesc),
          );
          toast.error(
            supplierRes.error || t(localizationConstants.errorDetailsDesc),
          );
        }
        setLoadingData(false);
      }
    };

    void fetchData();

    return () => {
      isCancelled = true;
    };
  }, [supplierId, form, t]);

  const handleSubmit = async (values: CreateSupplierValues) => {
    setSubmitting(true);
    try {
      const result = await updateSupplierAPIAction(supplierId, values);
      if (result.success) {
        toast.success(t(localizationConstants.supplierUpdatedSuccess));
        onSuccess();
      } else {
        toast.error(
          result.error || t(localizationConstants.supplierUpdateError),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50 p-6 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        <p className="text-sm font-medium text-slate-600">
          <Translate text={localizationConstants.loadingLabel} />
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50 p-6 gap-3">
        <p className="text-sm font-medium text-red-600" role="alert">
          {loadError}
        </p>
        <Button variant="outline" onClick={onBack}>
          <Translate text={localizationConstants.cancel} />
        </Button>
      </div>
    );
  }

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
            <Translate text={localizationConstants.supplierEditTitle} />
          </h1>
        </div>
        <p className="font-sans text-sm font-normal text-slate-500 leading-5 tracking-normal pl-[44px]">
          <Translate text={localizationConstants.supplierEditSubtitle} />
        </p>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        <Form {...form}>
          <form
            id="edit-supplier-form"
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
                    inputProps={{
                      onChange: (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const val = e.target.value.replace(/[<>]/g, "");
                        form.setValue("companyName", val, {
                          shouldValidate: true,
                        });
                      },
                    }}
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
                      onChange: (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
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
                      onChange: (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const val = e.target.value.replace(
                          /[^a-zA-ZåäöÅÄÖ\s\-']/g,
                          "",
                        );
                        form.setValue("contactFirstName", val, {
                          shouldValidate: true,
                        });
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
                      onChange: (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const val = e.target.value.replace(
                          /[^a-zA-ZåäöÅÄÖ\s\-']/g,
                          "",
                        );
                        form.setValue("contactLastName", val, {
                          shouldValidate: true,
                        });
                      },
                    }}
                  />
                </div>

                {/* Row 4: Mobile number */}
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
                      onChange: (
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const val = e.target.value.replace(/[^0-9+\s-()]/g, "");
                        form.setValue("mobileNo", val, {
                          shouldValidate: true,
                        });
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
            form="edit-supplier-form"
            disabled={submitting}
            className="min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <Translate text={localizationConstants.save} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
