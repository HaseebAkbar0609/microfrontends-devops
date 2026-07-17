"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/common/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { addUserSchema, type AddUserFormValues } from "@/schemas/admin/addUser.schema";
import { UserInformationSection } from "./UserInformationSection";
import { SystemSettingsSection } from "./SystemSettingsSection";

interface AddUserFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function AddUserForm({ onCancel, onSuccess }: AddUserFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInline = !!onCancel;

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userCredentials: "",
      password: "",
      name: "",
      confirmPassword: "",
      isActive: true,
      generateEmailForNewPassword: false,
      personalNumber: "",
      smsAuthentication: false,
      email: "",
      mobileNumber: "",
      employeeRegisterPerson: "",
      language: "sv",
      automaticLogout: "2h",
    },
  });

  async function onSubmit(_values: AddUserFormValues) {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t(localizationConstants.toastUserCreated));
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/users");
      }
    } catch {
      toast.error(t(localizationConstants.toastUserCreateError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/admin/users");
    }
  }

  if (!isInline) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-white">
        <PageHeader
          title={t(localizationConstants.adminUsers)}
          breadcrumbs={[
            { label: t(localizationConstants.breadcrumbHome), href: "/dashboard" },
            { label: t(localizationConstants.adminUsers) },
          ]}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 pt-4 pb-6 no-scrollbar">
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="shrink-0 h-8 w-8 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  <Translate text={localizationConstants.addUserTitle} />
                </h1>
                <p className="text-xs text-slate-500">
                  <Translate text={localizationConstants.addUserSubtitle} />
                </p>
              </div>
            </div>
            <Form {...form}>
              <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-[44px] w-full sm:w-[calc(100%-44px)]">
                <div className="rounded-lg border border-zinc-200 bg-white">
                  <UserInformationSection form={form} />
                  <SystemSettingsSection form={form} />
                </div>
              </form>
            </Form>
          </div>
          <footer className="h-16 flex items-center justify-end gap-3 border-t bg-white px-8 py-0 z-10 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="h-10! text-sm font-medium border-slate-200 text-slate-900 bg-transparent hover:bg-slate-100"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <Translate text={localizationConstants.addUserCancel} />
            </Button>
            <Button
              type="submit"
              form="add-user-form"
              className="h-10! text-sm font-medium bg-[#111721] text-white hover:bg-[#111721]/90"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              <Translate text={localizationConstants.addUserSave} />
            </Button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto px-8 pt-4 pb-6 no-scrollbar">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="shrink-0 h-8 w-8 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              <Translate text={localizationConstants.addUserTitle} />
            </h1>
            <p className="text-xs text-slate-500">
              <Translate text={localizationConstants.addUserSubtitle} />
            </p>
          </div>
        </div>
        <Form {...form}>
          <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-[44px] w-full sm:w-[calc(100%-44px)]">
            <div className="rounded-lg border border-zinc-200 bg-white">
              <UserInformationSection form={form} />
              <SystemSettingsSection form={form} />
            </div>
          </form>
        </Form>
      </div>
      <footer className="h-14 flex items-center justify-end gap-3 border-t bg-white px-8 py-0 z-10 shrink-0">
        <Button
          type="button"
          variant="outline"
          className="h-10! text-sm font-medium border-slate-200 text-slate-900 bg-transparent hover:bg-slate-100"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <Translate text={localizationConstants.addUserCancel} />
        </Button>
        <Button
          type="submit"
          form="add-user-form"
          className="h-10! text-sm font-medium bg-[#111721] text-white hover:bg-[#111721]/90"
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.addUserSave} />
        </Button>
      </footer>
    </div>
  );
}
