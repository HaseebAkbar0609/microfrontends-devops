"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import { AddRoutingRuleModal } from "@/features/leads/settings/components/sections/AddRoutingRuleModal";
import { showToast } from "@/lib/toast";
import {
  fetchRoutingRules,
  createRoutingRule,
  updateRoutingRule,
  deleteRoutingRule,
} from "@/features/leads/settings/api/routingRulesApi";

type RoutingRulesSectionProps = {
  maxCompanies: number;
  onMaxCompaniesChange: (value: number) => void;
  defaultOwnerEmail: string;
  onDefaultOwnerEmailChange: (value: string) => void;
  defaultOwnerEmailError?: string;
};

export function RoutingRulesSection({
  maxCompanies,
  onMaxCompaniesChange,
  defaultOwnerEmail,
  onDefaultOwnerEmailChange,
  defaultOwnerEmailError,
}: RoutingRulesSectionProps) {
  const t = useTranslate();
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["routing-rules"],
    queryFn: fetchRoutingRules,
  });

  const createMutation = useMutation({
    mutationFn: createRoutingRule,
    onSuccess: () => {
      showToast("success", "Routing rule added successfully");
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string; is_active: boolean }) =>
      updateRoutingRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
    },
    onError: () => {
      showToast("error", "Failed to update routing rule");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutingRule,
    onSuccess: () => {
      showToast("success", "Routing rule deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
    },
    onError: () => {
      showToast("error", "Failed to delete routing rule");
    },
  });

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard 
        titleKey={localizationConstants.matchingLogicTitle}
        action={
          <AddRoutingRuleModal
            onAdd={(name, description) => createMutation.mutateAsync({ name, description, is_active: true, order_index: rules.length })}
            isLoading={createMutation.isPending}
          />
        }
      >
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-sm text-slate-500">No routing rules found.</div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between group">
                <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                  <Checkbox
                    className="border border-black data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
                    checked={rule.is_active}
                    onCheckedChange={(checked) =>
                      updateMutation.mutate({ id: rule.id, is_active: Boolean(checked) })
                    }
                  />
                  <span>
                    {rule.name}
                    {rule.description && (
                      <span className="text-slate-500 ml-2">({rule.description})</span>
                    )}
                  </span>
                </label>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate(rule.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
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
