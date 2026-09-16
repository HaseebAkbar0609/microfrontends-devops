"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/common/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { getAddUserSchema, type AddUserFormValues } from "@/schemas/admin/addUser.schema";
import { UserInformationSection } from "./UserInformationSection";
import { SystemSettingsSection } from "./SystemSettingsSection";
import { AdminQueryState } from "./AdminQueryState";
import { useCreateAdminUser, useAdminUserDetail, useUpdateAdminUser } from "../hooks/useAdminUsers";
import { createUserPayload, updateUserPayload, userFormDefaults } from "../utils/adminUserForms";
import { applyAdminFormError } from "../utils/adminUserErrors";

interface AddUserFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function AddUserForm({ onCancel, onSuccess }: AddUserFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useSearchParams().get("id");
  const isEditMode = !!userId;
  const userQuery = useAdminUserDetail(userId ?? "");
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();
  const user = userQuery.data?.data;
  const initializedUser = useRef<string | null>(null);
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(getAddUserSchema(isEditMode, user?.editable_fields)),
    defaultValues: userFormDefaults(),
  });

  useEffect(() => {
    if (!userId) {
      initializedUser.current = null;
      form.reset(userFormDefaults());
    } else if (user && initializedUser.current !== userId) {
      form.reset(userFormDefaults(user));
      initializedUser.current = userId;
    }
  }, [user, userId, form]);

  const submitting = form.formState.isSubmitting || createUser.isPending || updateUser.isPending;
  const ready = !isEditMode || (!!user && !userQuery.isError && !userQuery.isPending && initializedUser.current === userId);
  const editable = !isEditMode || !!user?.available_actions?.includes("edit");
  const handleCancel = () => onCancel ? onCancel() : router.push("/admin/users");

  async function onSubmit(values: AddUserFormValues) {
    if (!ready || !editable || createUser.isPending || updateUser.isPending) return;
    form.clearErrors("root");
    try {
      if (userId && user) {
        await updateUser.mutateAsync({ userId, data: updateUserPayload(values, user) });
      } else {
        await createUser.mutateAsync(createUserPayload(values));
      }
      toast.success(t(isEditMode ? localizationConstants.toastUserUpdated : localizationConstants.toastUserCreated));
      if (onSuccess) onSuccess();
      else router.push("/admin/users");
    } catch (error) {
      applyAdminFormError(form, error, "profile");
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-slate-50">
      {!onCancel && <PageHeader title={t(localizationConstants.adminUsers)} breadcrumbs={[
        { label: t(localizationConstants.breadcrumbHome), href: "/home" },
        { label: t(localizationConstants.adminUsers), href: "/admin/users" },
        { label: t(isEditMode ? localizationConstants.editUserTitle : localizationConstants.addUserTitle) },
      ]} />}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 sm:px-8 no-scrollbar">
        <div className="mb-4 flex items-center gap-3">
          <button type="button" onClick={handleCancel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-100" aria-label={t(localizationConstants.adminBack)}>
            <ArrowLeft className="h-6 w-6 text-slate-900" />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">{t(isEditMode ? localizationConstants.editUserTitle : localizationConstants.addUserTitle)}</h1>
        </div>
        {isEditMode && <AdminQueryState loading={userQuery.isPending} error={userQuery.isError ? localizationConstants.adminUserLoadError : undefined} onRetry={() => void userQuery.refetch()} />}
        {ready && <>
          {!editable && <AdminQueryState error={localizationConstants.adminReadOnly} />}
          <Form {...form}>
            <form id="add-user-form" noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-11 w-full sm:w-[calc(100%-44px)]">
              {form.formState.errors.root?.server?.message && <p role="alert" className="mb-4 break-words text-sm text-red-600">{t(form.formState.errors.root.server.message)}</p>}
              <fieldset disabled={submitting || !editable} className="min-w-0 rounded-lg border border-zinc-200 bg-white">
                <UserInformationSection form={form} isEditMode={isEditMode} user={user} />
                <SystemSettingsSection form={form} user={user} />
              </fieldset>
            </form>
          </Form>
        </>}
      </div>
      <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" className="min-w-30 h-10" onClick={handleCancel} disabled={submitting}>{t(localizationConstants.addUserCancel)}</Button>
          <Button type="submit" form="add-user-form" className="min-w-30 h-10 gap-2 bg-slate-900 text-white hover:bg-slate-800" disabled={submitting || !ready || !editable}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t(submitting ? localizationConstants.adminSaving : localizationConstants.addUserSave)}
          </Button>
        </div>
      </footer>
    </div>
  );
}
