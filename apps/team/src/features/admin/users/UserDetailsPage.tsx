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

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const form = useForm<UserDetailsFormValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      isAdmin: true,
      group: "ekonomi",
      role: "manager",
      type: "arbetschef",
      reports: false,
      registerImportant: false,
      permSalesSell: false,
      permSalesMarknad: true,
      permSalesAll: true,
      permEconEkonomi: false,
      permEconFaktura: true,
      permEconPersonal: false,
      permEconJuridik: true,
      permEconPrognoser: false,
      permEconAll: true,
      permBizAvtal: true,
      permBizDataIT: false,
      permBizKMA: true,
      permBizMailet: true,
      permBizLedningsstod: false,
      permBizAll: true,
    },
  });

  async function onSubmit(_values: UserDetailsFormValues) {
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
