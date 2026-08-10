"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const isEditMode = !!userId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInline = !!onCancel;

  const initialValues: AddUserFormValues = useMemo(() => {
    if (userId === "1") {
      return {
        userCredentials: "kalle.a",
        password: "••••••••",
        firstName: "Kalle",
        lastName: "Andersson",
        confirmPassword: "••••••••",
        role: "sys-admin",
        department: "ekonomi",
        isActive: true,
        generateEmailForNewPassword: false,
        personalNumber: "710405-1010",
        smsAuthentication: true,
        email: "kalle@timeflow.se",
        mobileNumber: "+46 70 123 45 67",
        employeeRegisterPerson: "EMP-101",
        language: "sv",
        automaticLogout: "2h",
      };
    }
    if (userId === "2") {
      return {
        userCredentials: "sten.s",
        password: "••••••••",
        firstName: "Sten",
        lastName: "Svensson",
        confirmPassword: "••••••••",
        role: "admin",
        department: "service",
        isActive: true,
        generateEmailForNewPassword: true,
        personalNumber: "710405-1011",
        smsAuthentication: false,
        email: "sten@timeflow.se",
        mobileNumber: "+46 70 234 56 78",
        employeeRegisterPerson: "EMP-102",
        language: "sv",
        automaticLogout: "4h",
      };
    }
    if (userId === "3") {
      return {
        userCredentials: "sture.l",
        password: "••••••••",
        firstName: "Sture",
        lastName: "Larsson",
        confirmPassword: "••••••••",
        role: "user",
        department: "overhead",
        isActive: true,
        generateEmailForNewPassword: false,
        personalNumber: "710405-1012",
        smsAuthentication: false,
        email: "sture@timeflow.se",
        mobileNumber: "+46 70 345 67 89",
        employeeRegisterPerson: "EMP-103",
        language: "en",
        automaticLogout: "1h",
      };
    }
    return {
      userCredentials: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      role: "",
      department: "",
      isActive: true,
      generateEmailForNewPassword: false,
      personalNumber: "",
      smsAuthentication: false,
      email: "",
      mobileNumber: "",
      employeeRegisterPerson: "",
      language: "sv",
      automaticLogout: "2h",
    };
  }, [userId]);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(_values: AddUserFormValues) {
    setIsSubmitting(true);
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.05) {
            reject(new Error("Mock API Error"));
          } else {
            resolve();
          }
        }, 1000);
      });
      toast.success(t(isEditMode ? localizationConstants.toastUserUpdated : localizationConstants.toastUserCreated));
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/users");
      }
    } catch {
      toast.error(t(isEditMode ? localizationConstants.toastUserUpdateError : localizationConstants.toastUserCreateError));
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
      <div className="flex h-full flex-col overflow-hidden bg-slate-50">
        <PageHeader
          title={t(localizationConstants.adminUsers)}
          breadcrumbs={[
            { label: t(localizationConstants.breadcrumbHome), href: "/home" },
            { label: t(localizationConstants.adminUsers), href: "/admin/users" },
            { label: t(isEditMode ? localizationConstants.editUserTitle : localizationConstants.addUserTitle) },
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
                  <Translate text={isEditMode ? localizationConstants.editUserTitle : localizationConstants.addUserTitle} />
                </h1>
                <p className="text-xs text-slate-500">
                  <Translate text={localizationConstants.addUserSubtitle} />
                </p>
              </div>
            </div>
            <Form {...form}>
              <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-11 w-full sm:w-[calc(100%-44px)]">
                <div className="rounded-lg border border-zinc-200 bg-white">
                  <UserInformationSection form={form} />
                  <SystemSettingsSection form={form} />
                </div>
              </form>
            </Form>
          </div>
          <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-w-30 border-slate-200 text-slate-600 h-10 bg-transparent hover:bg-slate-100"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <Translate text={localizationConstants.addUserCancel} />
              </Button>
              <Button
                type="submit"
                form="add-user-form"
                className="min-w-30 bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                <Translate text={localizationConstants.addUserSave} />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
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
              <Translate text={isEditMode ? localizationConstants.editUserTitle : localizationConstants.addUserTitle} />
            </h1>
            <p className="text-xs text-slate-500">
              <Translate text={localizationConstants.addUserSubtitle} />
            </p>
          </div>
        </div>
        <Form {...form}>
          <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-11 w-full sm:w-[calc(100%-44px)]">
            <div className="rounded-lg border border-zinc-200 bg-white">
              <UserInformationSection form={form} />
              <SystemSettingsSection form={form} />
            </div>
          </form>
        </Form>
      </div>
      <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-30 border-slate-200 text-slate-600 h-10 bg-transparent hover:bg-slate-100"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <Translate text={localizationConstants.addUserCancel} />
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            className="min-w-30 bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            <Translate text={localizationConstants.addUserSave} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
