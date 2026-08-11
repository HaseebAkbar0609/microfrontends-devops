"use client";

import { useState, useEffect } from "react";
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
import { useCreateAdminUser, useAdminUserDetail, useUpdateAdminUser } from "../hooks/useAdminUsers";

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

  const { data: userResponse } = useAdminUserDetail(userId || "");
  const { mutateAsync: createUser } = useCreateAdminUser();
  const { mutateAsync: updateUser } = useUpdateAdminUser();

  const initialValues: AddUserFormValues = {
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

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (isEditMode && userResponse?.data) {
      const u = userResponse.data;
      // In edit mode, 'department' field contains the group UUID from the dropdown
      // 'role' contains the permission_role_id UUID
      
      let firstGroupId = u.department || "";
      if (Array.isArray(u.groups) && u.groups.length > 0) {
          const firstGroup = u.groups[0];
          if (typeof firstGroup === "object" && firstGroup !== null && "id" in firstGroup) {
              firstGroupId = firstGroup.id;
          }
      }
      
      form.reset({
        userCredentials: u.user_credentials || "",
        password: "",
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        confirmPassword: "",
        role: u.permission_role_id || "",
        department: firstGroupId,
        isActive: u.status === "active" || u.status === "ACTIVE",
        generateEmailForNewPassword: false,
        personalNumber: u.personal_id || "",
        smsAuthentication: u.sms_auth_enabled || false,
        email: u.email || "",
        mobileNumber: u.phone_number || "",
        employeeRegisterPerson: "",
        language: u.language_preference || "sv",
        automaticLogout: u.auto_logout_minutes ? `${u.auto_logout_minutes}m` : "2h",
      });
    }
  }, [userResponse, isEditMode, form]);

  function parseDurationToMinutes(duration: string): number {
    if (!duration) return 120;
    const val = parseInt(duration);
    if (isNaN(val)) return 120;
    if (duration.toLowerCase().endsWith("h")) return val * 60;
    return val;
  }

  async function onSubmit(values: AddUserFormValues) {
    if (!isEditMode) {
      if (!values.password || !values.confirmPassword) {
        form.setError("password", { message: localizationConstants.addUserValidationPasswordRequired });
        form.setError("confirmPassword", { message: localizationConstants.addUserValidationConfirmPasswordRequired });
        return;
      }
      if (!values.userCredentials) {
        form.setError("userCredentials", { message: localizationConstants.addUserValidationCredentialsRequired });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        first_name: values.firstName || "",
        last_name: values.lastName || "",
        email: values.email,
        user_credentials: values.userCredentials || undefined,
        phone_number: values.mobileNumber || null,
        personal_id: values.personalNumber || null,
        language: values.language || "sv",
        role: "worker", 
        department: values.department || undefined, 
        active: values.isActive,
        send_invitation: values.generateEmailForNewPassword,
        sms_authentication: values.smsAuthentication,
        auto_logout: parseDurationToMinutes(values.automaticLogout),
        permission_role_id: values.role || undefined,
      };

      if (!isEditMode) {
        payload.password = values.password || undefined;
        payload.confirm_password = values.confirmPassword || undefined;
      }

      if (isEditMode && userId) {
        await updateUser({ userId, data: payload });
      } else {
        await createUser(payload);
      }
      
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
