"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import type { RoutingRule } from "@/features/leads/settings/types";

type RoutingRulesSectionProps = {
	rules: RoutingRule[];
	onRuleToggle: (id: string, next: boolean) => void;
	maxCompanies: number;
	onMaxCompaniesChange: (value: number) => void;
	defaultOwnerEmail: string;
	onDefaultOwnerEmailChange: (value: string) => void;
	defaultOwnerEmailError?: string;
};

export function RoutingRulesSection({
	rules,
	onRuleToggle,
	maxCompanies,
	onMaxCompaniesChange,
	defaultOwnerEmail,
	onDefaultOwnerEmailChange,
	defaultOwnerEmailError,
}: RoutingRulesSectionProps) {
  const t = useTranslate();

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard titleKey={localizationConstants.matchingLogicTitle}>
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

      <SettingsCard titleKey={localizationConstants.sendLimitsTitle}>
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase text-slate-500">
            <Translate text={localizationConstants.maxCompaniesPerRequestLabel} />
          </div>
          <Input
            type="number"
            value={maxCompanies}
            onChange={(event) => onMaxCompaniesChange(Number(event.target.value))}
            className="h-10 w-[160px] border-slate-900 text-slate-900 focus-visible:ring-slate-900"
          />
        </div>
      </SettingsCard>

      <SettingsCard titleKey={localizationConstants.defaultOwnerAssignmentTitle}>
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase text-slate-500">
            <Translate text={localizationConstants.emailLabel} />
          </div>
          <Input
            type="email"
            value={defaultOwnerEmail}
            onChange={(event) => onDefaultOwnerEmailChange(event.target.value)}
            placeholder={t(localizationConstants.leadSettingsEmailPlaceholder)}
            aria-invalid={Boolean(defaultOwnerEmailError)}
            className="h-10 max-w-md border-slate-900 text-slate-900 focus-visible:ring-slate-900 aria-invalid:border-red-500 aria-invalid:ring-red-500"
          />
          {defaultOwnerEmailError ? (
            <p className="text-xs text-red-600">{defaultOwnerEmailError}</p>
          ) : null}
        </div>
      </SettingsCard>
    </div>
  );
}
