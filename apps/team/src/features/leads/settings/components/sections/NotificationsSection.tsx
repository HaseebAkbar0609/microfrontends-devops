"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import { reminderRules } from "@/features/leads/settings/constants";
import { fetchNotificationsSla, updateNotificationsSla, type NotificationsSlaApiData } from "@/features/leads/settings/api/notificationsSlaApi";
import { showToast } from "@/lib/toast";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NotificationsSection() {
  const t = useTranslate();
  const queryClient = useQueryClient();

  const [localEmail, setLocalEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications-sla"],
    queryFn: fetchNotificationsSla,
  });

  useEffect(() => {
    if (data?.escalation_email) {
      setLocalEmail(data.escalation_email);
    }
  }, [data?.escalation_email]);

  const updateMutation = useMutation({
    mutationFn: updateNotificationsSla,
    onSuccess: (updated) => {
      queryClient.setQueryData(["notifications-sla"], updated);
      showToast("success", t(localizationConstants.settingsSavedToast));
    },
    onError: () => {
      showToast("error", t(localizationConstants.settingsSaveErrorToast));
    },
  });

  const handleRuleToggle = (id: string, checked: boolean) => {
    const payload: Partial<NotificationsSlaApiData> = {};
    if (id === "watch-48") payload.send_reminder = checked;
    if (id === "notify-owner") payload.notify_owner = checked;
    updateMutation.mutate(payload);
  };

  const handleEscalateToggle = (checked: boolean) => {
    updateMutation.mutate({ escalate: checked });
  };

  const handleEmailBlur = () => {
    const trimmed = localEmail.trim();
    if (trimmed && !EMAIL_PATTERN.test(trimmed)) {
      setEmailError(t(localizationConstants.leadSettingsInvalidEmail));
      return;
    }
    setEmailError("");
    if (trimmed !== data?.escalation_email) {
      updateMutation.mutate({ escalation_email: trimmed });
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading notifications settings...</div>;
  }

  const rules = reminderRules.map((rule) => ({
    ...rule,
    checked: rule.id === "watch-48" ? !!data?.send_reminder : !!data?.notify_owner,
  }));

  const escalate = !!data?.escalate;

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard titleKey={localizationConstants.reminderRulesTitle}>
        <div className="space-y-4">
          {rules.map((rule) => (
            <label key={rule.id} className="flex items-center gap-3 text-sm text-slate-700">
              <Checkbox
                className="border border-black data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
                checked={rule.checked}
                onCheckedChange={(checked) => handleRuleToggle(rule.id, Boolean(checked))}
              />
              <Translate text={rule.labelKey} />
            </label>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard titleKey={localizationConstants.slaEscalationTitle}>
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <Checkbox
              className="border border-black data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
              checked={escalate}
              onCheckedChange={(checked) => handleEscalateToggle(Boolean(checked))}
            />
            <Translate text={localizationConstants.escalateManagerReview24h} />
          </label>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase text-slate-500">
              <Translate text={localizationConstants.escalationRecipientLabel} />
            </div>
            <Input
              type="email"
              value={localEmail}
              onChange={(event) => {
                setLocalEmail(event.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={handleEmailBlur}
              placeholder={t(localizationConstants.leadSettingsEmailPlaceholder)}
              disabled={!escalate}
              aria-invalid={Boolean(emailError)}
              className="h-10 max-w-md border-slate-900 text-slate-900 focus-visible:ring-slate-900 aria-invalid:border-red-500 aria-invalid:ring-red-500 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            />
            {emailError ? (
              <p className="text-xs text-red-600">{emailError}</p>
            ) : null}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
