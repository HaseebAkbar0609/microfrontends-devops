"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { UserDetailsSection } from "./components/UserDetailsSection";
import { AdminQueryState } from "./components/AdminQueryState";
import { userDetailsSchema, type UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import { useAdminUserDetail, useUpdateAdminUser } from "./hooks/useAdminUsers";
import { detailsFormDefaults, detailsPayload } from "./utils/adminUserForms";
import { applyAdminFormError } from "./utils/adminUserErrors";

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useSearchParams().get("id");
  const [showDetails, setShowDetails] = useState(true);
  const initializedUser = useRef<string | null>(null);
  const query = useAdminUserDetail(userId ?? "");
  const user = query.data?.data;
  const updateUser = useUpdateAdminUser();
  const form = useForm<UserDetailsFormValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: { accessRole: "worker", group: "", role: "", type: "", reports: false, registerImportant: false, permissions: {} },
  });

  useEffect(() => {
    if (user && initializedUser.current !== user.id) {
      form.reset(detailsFormDefaults(user));
      initializedUser.current = user.id;
    }
  }, [user, form]);

  const editable = !!user?.available_actions?.includes("edit");
  const ready = !!user && !query.isPending && !query.isError && initializedUser.current === userId;
  const submitting = updateUser.isPending || form.formState.isSubmitting;
  const handleCancel = () => router.push("/admin/users");

  async function onSubmit(values: UserDetailsFormValues) {
    if (!userId || !user || !ready || !editable || updateUser.isPending) return;
    form.clearErrors("root");
    try {
      await updateUser.mutateAsync({ userId, data: detailsPayload(values, user) });
      toast.success(t(localizationConstants.toastUserUpdated));
      router.push("/admin/users");
    } catch (error) {
      applyAdminFormError(form, error, "details");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 sm:px-8 no-scrollbar">
        <div className="mb-4 flex items-center gap-3">
          <button type="button" onClick={handleCancel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-100" aria-label={t(localizationConstants.adminBack)}><ArrowLeft className="h-6 w-6 text-slate-900" /></button>
          <h1 className="text-xl font-semibold text-slate-900">{t(localizationConstants.userDetailsTitle)}</h1>
        </div>
        {!userId ? <AdminQueryState empty={localizationConstants.adminNoUserSelected} /> : <AdminQueryState loading={query.isPending} error={query.isError ? localizationConstants.adminUserLoadError : undefined} onRetry={() => void query.refetch()} />}
        {ready && user && <>
          {!editable && <AdminQueryState error={localizationConstants.adminReadOnly} />}
          <Form {...form}>
            <form id="user-details-form" noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-11 w-full sm:w-[calc(100%-44px)]">
              {form.formState.errors.root?.server?.message && <p role="alert" className="mb-4 break-words text-sm text-red-600">{t(form.formState.errors.root.server.message)}</p>}
              <fieldset disabled={submitting || !editable} className="min-w-0">
                <UserDetailsSection form={form} user={user} showDetails={showDetails} onToggleDetails={() => setShowDetails(!showDetails)} />
              </fieldset>
            </form>
          </Form>
        </>}
      </div>
      <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" className="min-w-30 h-10" onClick={handleCancel} disabled={submitting}>{t(localizationConstants.addUserCancel)}</Button>
          <Button type="submit" form="user-details-form" className="min-w-30 h-10 gap-2 bg-slate-900 text-white hover:bg-slate-800" disabled={submitting || !ready || !editable}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t(submitting ? localizationConstants.adminSaving : localizationConstants.addUserSave)}
          </Button>
        </div>
      </footer>
    </div>
  );
}
