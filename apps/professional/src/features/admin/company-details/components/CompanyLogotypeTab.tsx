"use client";

import type { UseFormReturn } from "react-hook-form";
import { Image as  ImageUp, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormFileUpload } from "@/components/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CompanyInformationFormValues } from "../schemas/companyInformation.schema";
import { LOGOTYPE_ACCEPT, LOGOTYPE_ALLOWED_TYPES } from "../constants";

type CompanyLogotypeTabProps = {
  form: UseFormReturn<CompanyInformationFormValues>;
  onSubmit: (data: CompanyInformationFormValues) => Promise<void>;
  lastSavedRef: { current: CompanyInformationFormValues | null };
  /** The logo's real upload name, from GET /company-information -- the
   * field's own value is just a signed URL ending in a UUID storage key. */
  remoteFileName?: string;
};

export function CompanyLogotypeTab({
  form,
  onSubmit,
  lastSavedRef,
  remoteFileName,
}: CompanyLogotypeTabProps) {
  const { control, getValues } = form;

  // Deliberately not form.handleSubmit(onSubmit): that runs the *whole*
  // shared schema (companyInformationSchema), including outgoingEmail,
  // which is required on the Company Information tab but isn't shown here.
  // On a company that hasn't set one yet, handleSubmit would fail that
  // validation silently -- no error renders on this tab -- and Save would
  // look like it does nothing. Saving just the logo only needs the current
  // field values, not that whole-form validation.
  const handleLogoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void onSubmit(getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={handleLogoSubmit} className="flex flex-col gap-6 ">
        <CollapsibleSection
          className="rounded-md border border-slate-200 bg-white py-4 shadow-sm max-w-[790px]"
          contentClassName="px-5"
          icon={<ImageUp size={24} className="text-slate-700" />}
          title={<Translate text={localizationConstants.companyLogotype} />}
          defaultOpen
        >
          <div className="w-md mr-auto">
          <FormFileUpload
            control={control}
            name="companyLogotype"
            remoteFileName={remoteFileName}
            label={localizationConstants.uploadYourLogotype}
            buttonLabel={localizationConstants.upload}
            placeholder={localizationConstants.noFileChosen}
            helperText={localizationConstants.logotypeFileTypesAllowed}
            invalidTypeMessage={localizationConstants.logotypeUnsupportedFileType}
            accept={LOGOTYPE_ACCEPT}
            allowedTypes={[...LOGOTYPE_ALLOWED_TYPES]}
            showPreview
            previewVariant="logo"
            previewLabel={localizationConstants.logo}
            allowClear
            clearButtonAriaLabel={localizationConstants.removeLogo}
            inputClassName="bg-white"
            buttonClassName="bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
            previewContainerClassName="bg-white"
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
