"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import type { ReminderRule } from "@/features/leads/settings/types";

type NotificationsSectionProps = {
	rules: ReminderRule[];
	onRuleToggle: (id: string, next: boolean) => void;
	escalate: boolean;
	onEscalateChange: (next: boolean) => void;
	escalationEmail: string;
	onEscalationEmailChange: (value: string) => void;
	escalationEmailError?: string;
};

export function NotificationsSection({
	rules,
	onRuleToggle,
	escalate,
	onEscalateChange,
	escalationEmail,
	onEscalationEmailChange,
	escalationEmailError,
}: NotificationsSectionProps) {
  const t = useTranslate();

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard titleKey={localizationConstants.reminderRulesTitle}>
        <div className="space-y-4">
          {rules.map((rule) => (
            <label key={rule.id} className="flex items-center gap-3 text-sm text-slate-700">
              <Checkbox
                className="border border-black data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
                checked={rule.checked}
                onCheckedChange={(checked) => onRuleToggle(rule.id, Boolean(checked))}
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
              onCheckedChange={(checked) => onEscalateChange(Boolean(checked))}
            />
            <Translate text={localizationConstants.escalateManagerReview24h} />
          </label>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase text-slate-500">
              <Translate text={localizationConstants.escalationRecipientLabel} />
            </div>
            <Input
              type="email"
              value={escalationEmail}
              onChange={(event) => onEscalationEmailChange(event.target.value)}
              placeholder={t(localizationConstants.leadSettingsEmailPlaceholder)}
              disabled={!escalate}
              aria-invalid={Boolean(escalationEmailError)}
              className="h-10 max-w-md border-slate-900 text-slate-900 focus-visible:ring-slate-900 aria-invalid:border-red-500 aria-invalid:ring-red-500 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            />
            {escalationEmailError ? (
              <p className="text-xs text-red-600">{escalationEmailError}</p>
            ) : null}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
