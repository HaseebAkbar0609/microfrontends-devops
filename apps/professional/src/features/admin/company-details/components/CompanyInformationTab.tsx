"use client";

import type { UseFormReturn } from "react-hook-form";
import { Building2, MapPinned, Users, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormInput } from "@/components/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CompanyInformationFormValues } from "../schemas/companyInformation.schema";

type CompanyInformationTabProps = {
  form: UseFormReturn<CompanyInformationFormValues>;
  onSubmit: (data: CompanyInformationFormValues) => Promise<void>;
  lastSavedRef: { current: CompanyInformationFormValues | null };
};

export function CompanyInformationTab({
  form,
  onSubmit,
  lastSavedRef,
}: CompanyInformationTabProps) {
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <CollapsibleSection
          className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
          contentClassName="px-5"
          icon={<Building2 size={24} className="text-slate-700" />}
          title={<Translate text={localizationConstants.company} />}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="companyName"
              label={localizationConstants.companyName}
              placeholder={localizationConstants.companyName}
              disabled
            />
            <FormInput
              control={control}
              name="orgNumber"
              label={localizationConstants.orgNumber}
              placeholder={localizationConstants.orgNumber}
              disabled
            />
            <FormInput
              control={control}
              name="vatNumber"
              label={localizationConstants.vatNumber}
              placeholder={localizationConstants.vatNumber}
              
            />
            <FormInput
              control={control}
              name="sniCode"
              label={localizationConstants.sniCode}
              placeholder={localizationConstants.sniCode}
              
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
          contentClassName="space-y-6 px-5"
          icon={<MapPinned size={24} className="text-slate-700" />}
          title={<Translate text={localizationConstants.address} />}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="postalAddress.streetAddress"
              label={localizationConstants.postalAddress}
              placeholder={localizationConstants.streetAddress}
              
            />
            <FormInput
              control={control}
              name="postalAddress.postalCode"
              label={localizationConstants.companyPostNo}
              placeholder={localizationConstants.companyPostNo}
              
            />
            <FormInput
              control={control}
              name="postalAddress.city"
              label={localizationConstants.companyPlace}
              placeholder={localizationConstants.companyPlace}
              
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="visitingAddress.streetAddress"
              label={localizationConstants.visitingAddress}
              placeholder={localizationConstants.streetAddress}
              
            />
            <FormInput
              control={control}
              name="visitingAddress.postalCode"
              label={localizationConstants.companyPostNo}
              placeholder={localizationConstants.companyPostNo}
              
            />
            <FormInput
              control={control}
              name="visitingAddress.city"
              label={localizationConstants.companyPlace}
              placeholder={localizationConstants.companyPlace}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="deliveryAddress.streetAddress"
              label={localizationConstants.deliveryAddress}
              placeholder={localizationConstants.streetAddress}
              
            />
            <FormInput
              control={control}
              name="deliveryAddress.postalCode"
              label={localizationConstants.companyPostNo}
              placeholder={localizationConstants.companyPostNo}
              
            />
            <FormInput
              control={control}
              name="deliveryAddress.city"
              label={localizationConstants.companyPlace}
              placeholder={localizationConstants.companyPlace}
              
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="phone"
              label={localizationConstants.companyGear}
              placeholder={localizationConstants.companyGear}
              
            />
            <FormInput
              control={control}
              name="email"
              label={localizationConstants.email}
              placeholder={localizationConstants.email}
              
            />
            <FormInput
              control={control}
              name="website"
              label={localizationConstants.website}
              placeholder={localizationConstants.website}
             
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
          contentClassName="px-5"
          icon={<Users size={24} className="text-slate-700" />}
          title={<Translate text={localizationConstants.alternativeContacts} />}
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="outgoingEmail"
              label={localizationConstants.outgoingEmail}
              placeholder={localizationConstants.outgoingEmail}
              
              messageClassName="text-xs text-red-600 mt-1"
            />
            <FormInput
              control={control}
              name="supplierInvoiceEmail"
              label={localizationConstants.supplierInvoiceEmail}
              placeholder={localizationConstants.supplierInvoiceEmail}
              
            />
            <FormInput
              control={control}
              name="smsNumber"
              label={localizationConstants.smsNumber}
              placeholder={localizationConstants.smsNumber}
              
            />
          </div>
        </CollapsibleSection>

        <div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              className="border border-slate-200 w-[204px] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
              onClick={() => {
                const lastSaved = lastSavedRef.current;
                if (lastSaved) {
                  form.reset(lastSaved);
                }
              }}
            >
              <Translate text={localizationConstants.cancel} />
            </Button>
            <Button
              type="submit"
              className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
            >
              <Save size={16} />
              <Translate text={localizationConstants.save} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
