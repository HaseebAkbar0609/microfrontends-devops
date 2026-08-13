"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { UserDetailsSection } from "./components/UserDetailsSection";

import { userDetailsSchema, type UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import { useAdminUserDetail, useUpdateAdminUser, useUpdateUserPermissions } from "./hooks/useAdminUsers";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const { data: userResponse } = useAdminUserDetail(userId || "");
  const { mutateAsync: updateUser } = useUpdateAdminUser();

  const form = useForm<UserDetailsFormValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      isAdmin: false,
      group: "",
      role: "",
      type: "",
      reports: false,
      registerImportant: false,
      permissions: {},
    },
  });

  useEffect(() => {
    if (userResponse?.data) {
      const user = userResponse.data;
      const perms = user.module_permissions || {};
      // user.department contains the group UUID.
      let firstGroupId = user.department || "";
      if (Array.isArray(user.groups) && user.groups.length > 0) {
        const firstGroup = user.groups[0];
        if (typeof firstGroup === "object" && firstGroup !== null && "id" in firstGroup) {
          firstGroupId = firstGroup.id;
        } else if (typeof firstGroup === "string") {
          // Note: If groups is array of strings due to Pydantic coercion, fallback to user.department
          firstGroupId = user.department || "";
        }
      }
      form.reset({
        isAdmin: user.role === "owner" || user.role === "manage" || user.role === "MANAGE" || user.role === "OWNER",
        group: firstGroupId,
        role: user.permission_role_id || "",
        type: user.position_id || "",
        reports: perms.reports || false,
        registerImportant: perms.registerImportant || false,
        permissions: perms,
      });
    }
  }, [userResponse, form]);

  const { mutateAsync: updateUserPermissions } = useUpdateUserPermissions();

  async function onSubmit(values: UserDetailsFormValues) {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const payload = {
        role: values.isAdmin ? "manage" : "worker",
        department: values.group || undefined,
        position_id: values.type || undefined,
        permission_role_id: values.role || undefined,
      };

      // Build permissions payload: only include keys with boolean true/false (not undefined)
      const rawPerms = {
        reports: values.reports,
        registerImportant: values.registerImportant,
        ...(values.permissions || {}),
      };
      const permissionsPayload: Record<string, boolean> = {};
      for (const [key, val] of Object.entries(rawPerms)) {
        if (typeof val === "boolean") {
          permissionsPayload[key] = val;
        }
      }

      await Promise.all([
        updateUser({ userId, data: payload }),
        updateUserPermissions({ userId, module_permissions: permissionsPayload })
      ]);

      toast.success(t(localizationConstants.toastUserUpdated));
      router.push("/admin/users");
    } catch {
      toast.error(t(localizationConstants.toastUserUpdateError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/admin/users");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-6 no-scrollbar">
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 h-8 w-8 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={2} />
            </button>
            <h1 className="text-xl font-semibold text-slate-900">
              <Translate text={localizationConstants.userDetailsTitle} />
            </h1>
          </div>

          <Form {...form}>
            <form id="user-details-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ml-0 sm:ml-[44px] w-full sm:w-[calc(100%-44px)]">
              <UserDetailsSection
                form={form}
                showDetails={showDetails}
                onToggleDetails={() => setShowDetails(!showDetails)}
              />
            </form>
          </Form>
        </div>

        <footer className="shrink-0 border-t bg-white px-6 py-4 z-10">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px] border-slate-200 text-slate-600 h-10 bg-transparent hover:bg-slate-100"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <Translate text={localizationConstants.addUserCancel} />
            </Button>
            <Button
              type="submit"
              form="user-details-form"
              className="min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2"
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
