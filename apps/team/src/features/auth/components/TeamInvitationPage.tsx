"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import localizationConstants from "@/utils/translation/constants";
import { AdminQueryState } from "@/features/admin/users/components/AdminQueryState";
import { adminErrorBody, adminFieldErrors } from "@/features/admin/users/utils/adminUserErrors";
import { useAuthStatus } from "@/context/AuthContext";
import { acceptTeamInvitation, validateTeamInvitation } from "../api/teamInvitation.api";
import { teamInvitationSchema, type TeamInvitationValues } from "../schemas/teamInvitation.schema";

export default function TeamInvitationPage() {
  const { t } = useTranslation();
  const token = useSearchParams().get("token") ?? "";
  const { clearSession } = useAuthStatus();
  const [accepted, setAccepted] = useState(false);
  const query = useQuery({ queryKey: ["team-invitation", token], queryFn: () => validateTeamInvitation(token), enabled: !!token && !accepted, retry: false, gcTime: 0, staleTime: Infinity, refetchOnWindowFocus: false });
  const form = useForm<TeamInvitationValues>({ resolver: zodResolver(teamInvitationSchema(query.data?.requires_password ?? false)), defaultValues: { password: "", confirmPassword: "" } });

  async function onSubmit(values: TeamInvitationValues) {
    if (!query.data || query.isError || !token || accepted) return;
    form.clearErrors();
    try {
      await acceptTeamInvitation(token, query.data.requires_password, values);
      form.reset();
      setAccepted(true);
      window.history.replaceState(null, "", window.location.pathname);
    } catch (error) {
      const body = adminErrorBody(error);
      const code = String(body.message ?? "");
      const fieldErrors = adminFieldErrors(error);
      const message = /PASSWORD.*(DIFFERENT|NEW|REUSE|CHANGE)|INITIAL_PASSWORD/.test(code) ? localizationConstants.teamInvitationNewPassword : /TOKEN|INVITATION.*(INVALID|EXPIRED|USED)/.test(code) ? localizationConstants.teamInvitationInvalid : localizationConstants.adminActionError;
      if (query.data.requires_password && /PASSWORD/.test(code)) form.setError("password", { type: "server", message });
      for (const [apiField, fieldMessage] of Object.entries(fieldErrors)) {
        const field = apiField === "confirm_password" ? "confirmPassword" : apiField === "password" ? "password" : null;
        if (field) form.setError(field, { type: "server", message: /administrator-provided/.test(fieldMessage) ? localizationConstants.teamInvitationNewPassword : fieldMessage });
      }
      form.setError("root.server", { message });
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">{t(localizationConstants.teamInvitationTitle)}</h1>
      {accepted ? <>
        <p role="status" className="flex items-center gap-2 text-sm text-green-700"><Check className="h-5 w-5" />{t(localizationConstants.teamInvitationAccepted)}</p>
        <Button asChild><Link href="/login" onClick={clearSession}><LogIn className="mr-2 h-4 w-4" />{t(localizationConstants.loginButtonText)}</Link></Button>
      </> : !token || query.isError ? <AdminQueryState error={localizationConstants.teamInvitationInvalid} onRetry={token ? () => void query.refetch() : undefined} /> : query.isPending ? <AdminQueryState loading /> : query.data && <>
        <p className="break-words text-base font-medium text-slate-700">{query.data.company_name}</p>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {form.formState.errors.root?.server?.message && <p role="alert" className="break-words text-sm text-red-600">{t(form.formState.errors.root.server.message)}</p>}
            <fieldset disabled={form.formState.isSubmitting} className="flex min-w-0 flex-col gap-4">
              {query.data.requires_password && <>
                <FormInput control={form.control} name="password" type="password" label={localizationConstants.newPassword} inputProps={{ autoComplete: "new-password" }} />
                <FormInput control={form.control} name="confirmPassword" type="password" label={localizationConstants.confirmPassword} inputProps={{ autoComplete: "new-password" }} />
              </>}
              <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">{form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{t(form.formState.isSubmitting ? localizationConstants.adminSaving : localizationConstants.teamInvitationAccept)}</Button>
            </fieldset>
          </form>
        </Form>
      </>}
    </main>
  );
}
