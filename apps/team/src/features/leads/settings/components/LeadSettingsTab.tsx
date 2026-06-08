"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { leadSettingsTabs, routingRules, reminderRules, stageSections } from "@/features/leads/settings/constants";
import type { LeadSettingsTabValue, ScheduleDay } from "@/features/leads/settings/types";
import { PipelineStagesSection } from "@/features/leads/settings/components/sections/PipelineStagesSection";
import { CategoriesSection } from "@/features/leads/settings/components/sections/CategoriesSection";
import { RoutingRulesSection } from "@/features/leads/settings/components/sections/RoutingRulesSection";
import { NotificationsSection } from "@/features/leads/settings/components/sections/NotificationsSection";
import { PermissionsSection } from "@/features/leads/settings/components/sections/PermissionsSection";
import { fetchLeadSettings, updateLeadSettings } from "@/features/leads/settings/api/leadSettings";
import type { LeadSettingsApiData } from "@/features/leads/settings/types/leadSettingsApi";
import { showToast } from "@/lib/toast";

type LeadSettingsForm = {
	id?: string;
	mode: Record<"review" | "monitor", "automatic" | "manual">;
	scheduleByStage: Record<"review" | "monitor", ScheduleDay[]>;
	monitorDaysForReshipment: string;
	routing: {
		matchByCategoryRegion: boolean;
		considerCompanyRating: boolean;
		prioritizeResponseRate: boolean;
	};
	maxCompanies: number;
	defaultOwnerEmail: string;
	notifications: {
		sendReminder: boolean;
		notifyOwner: boolean;
		escalate: boolean;
		escalationEmail: string;
		reminderAfterHours: number;
		escalateAfterHours: number;
	};
	isActive: boolean;
};

const DEFAULT_OWNER_EMAIL = "ava.wright@gmail.com";
const DEFAULT_ESCALATION_EMAIL = "manager@timeflow.se";
const DEFAULT_MAX_COMPANIES = 5;
const DEFAULT_RESHIPMENT_DAYS = "14";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelNameById: Record<string, string> = {
	mon: "Monday",
	tue: "Tuesday",
	wed: "Wednesday",
	thu: "Thursday",
	fri: "Friday",
};

function normalizeTime(value?: string): string | undefined {
	if (!value) return undefined;
	const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return value;
	const hours = match[1]?.padStart(2, "0");
	const minutes = match[2];
	return `${hours}:${minutes}`;
}

function buildScheduleMap(source?: Record<string, unknown>): Record<string, string> {
	if (!source) return {};
	const root =
		"additionalProp1" in source && typeof source.additionalProp1 === "object" && source.additionalProp1
			? (source.additionalProp1 as Record<string, unknown>)
			: source;
	const entries = Object.entries(root ?? {});
	return entries.reduce<Record<string, string>>((acc, [key, value]) => {
		if (typeof value === "string") {
			acc[key.toLowerCase()] = value;
		}
		return acc;
	}, {});
}

function applySchedule(
	fallback: ScheduleDay[],
	apiSchedule?: Record<string, unknown>
): ScheduleDay[] {
	const scheduleMap = buildScheduleMap(apiSchedule);
	const hasAny = Object.keys(scheduleMap).length > 0;
	return fallback.map((day) => {
		const label = labelNameById[day.id] ?? day.id;
		const mapped = normalizeTime(scheduleMap[label.toLowerCase()]);
		const time = hasAny ? (mapped ?? "") : day.time;
		return { ...day, time };
	});
}

function toMode(value?: string): "automatic" | "manual" {
	return value?.toLowerCase() === "manual" ? "manual" : "automatic";
}

function toApiMode(value: "automatic" | "manual"): string {
	return value === "manual" ? "Manual" : "Automatic";
}

function validateEmail(value: string, invalidMessage: string): string {
	const normalized = value.trim();
	if (!normalized) return "";
	return EMAIL_PATTERN.test(normalized) ? "" : invalidMessage;
}

function buildDefaultForm(): LeadSettingsForm {
	const reviewSchedule = stageSections.find((section) => section.id === "review")?.schedule ?? [];
	const monitorSchedule = stageSections.find((section) => section.id === "monitor")?.schedule ?? [];

	return {
		mode: {
			review: "automatic",
			monitor: "automatic",
		},
		scheduleByStage: {
			review: reviewSchedule,
			monitor: monitorSchedule,
		},
		monitorDaysForReshipment: DEFAULT_RESHIPMENT_DAYS,
		routing: {
			matchByCategoryRegion: false,
			considerCompanyRating: false,
			prioritizeResponseRate: false,
		},
		maxCompanies: DEFAULT_MAX_COMPANIES,
		defaultOwnerEmail: DEFAULT_OWNER_EMAIL,
		notifications: {
			sendReminder: false,
			notifyOwner: false,
			escalate: false,
			escalationEmail: DEFAULT_ESCALATION_EMAIL,
			reminderAfterHours: 0,
			escalateAfterHours: 0,
		},
		isActive: true,
	};
}

function mapApiToForm(apiData: LeadSettingsApiData | null): LeadSettingsForm {
	const fallback = buildDefaultForm();
	if (!apiData) return fallback;

	return {
		...fallback,
		id: apiData.id ?? fallback.id,
		mode: {
			review: toMode(apiData.review_mode),
			monitor: toMode(apiData.monitor_mode),
		},
		scheduleByStage: {
			review: applySchedule(fallback.scheduleByStage.review, apiData.review_schedule),
			monitor: applySchedule(fallback.scheduleByStage.monitor, apiData.monitor_schedule),
		},
		monitorDaysForReshipment:
			apiData.monitor_days_for_reshipment !== undefined
				? String(apiData.monitor_days_for_reshipment)
				: fallback.monitorDaysForReshipment,
		routing: {
			matchByCategoryRegion: apiData.match_by_category_region ?? fallback.routing.matchByCategoryRegion,
			considerCompanyRating: apiData.consider_company_rating ?? fallback.routing.considerCompanyRating,
			prioritizeResponseRate: apiData.prioritize_response_rate ?? fallback.routing.prioritizeResponseRate,
		},
		maxCompanies: apiData.max_companies ?? fallback.maxCompanies,
		defaultOwnerEmail: apiData.default_owner_email ?? fallback.defaultOwnerEmail,
		notifications: {
			sendReminder: apiData.send_reminder ?? fallback.notifications.sendReminder,
			notifyOwner: apiData.notify_owner ?? fallback.notifications.notifyOwner,
			escalate: apiData.escalate ?? fallback.notifications.escalate,
			escalationEmail: apiData.escalation_email ?? fallback.notifications.escalationEmail,
			reminderAfterHours: apiData.reminder_after_hours ?? fallback.notifications.reminderAfterHours,
			escalateAfterHours: apiData.escalate_after_hours ?? fallback.notifications.escalateAfterHours,
		},
		isActive: apiData.is_active ?? fallback.isActive,
	};
}

function mapFormToApi(form: LeadSettingsForm): LeadSettingsApiData {
	const buildSchedulePayload = (schedule: ScheduleDay[]) => {
		const dayTimes: Record<string, string> = {};
		schedule.forEach((day) => {
			const label = labelNameById[day.id] ?? day.id;
			if (day.time) {
				dayTimes[label] = day.time;
			}
		});
		return { additionalProp1: dayTimes };
	};

	return {
		id: form.id,
		review_mode: toApiMode(form.mode.review),
		monitor_mode: toApiMode(form.mode.monitor),
		review_schedule: buildSchedulePayload(form.scheduleByStage.review),
		monitor_schedule: buildSchedulePayload(form.scheduleByStage.monitor),
		monitor_days_for_reshipment: Number(form.monitorDaysForReshipment),
		match_by_category_region: form.routing.matchByCategoryRegion,
		consider_company_rating: form.routing.considerCompanyRating,
		prioritize_response_rate: form.routing.prioritizeResponseRate,
		max_companies: form.maxCompanies,
		default_owner_email: form.defaultOwnerEmail,
		send_reminder: form.notifications.sendReminder,
		notify_owner: form.notifications.notifyOwner,
		escalate: form.notifications.escalate,
		escalation_email: form.notifications.escalationEmail,
		reminder_after_hours: form.notifications.reminderAfterHours,
		escalate_after_hours: form.notifications.escalateAfterHours,
		is_active: form.isActive,
	};
}

export function LeadSettingsTab() {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState<LeadSettingsTabValue>("pipeline");
  const [form, setForm] = useState<LeadSettingsForm>(() => buildDefaultForm());
  const [pendingModeChange, setPendingModeChange] = useState<{
    stageId: "review" | "monitor";
    value: "automatic" | "manual";
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: leadSettingsData, refetch } = useQuery({
    queryKey: ["lead-settings"],
    queryFn: fetchLeadSettings,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setForm(mapApiToForm(leadSettingsData ?? null));
  }, [leadSettingsData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: LeadSettingsApiData) => updateLeadSettings(payload),
    onSuccess: async (data) => {
      showToast("success", t(localizationConstants.settingsSavedToast));
      if (data) {
        queryClient.setQueryData(["lead-settings"], data);
        setForm(mapApiToForm(data));
      } else {
        await queryClient.invalidateQueries({ queryKey: ["lead-settings"] });
        const latest = await refetch();
        if (latest.data) {
          setForm(mapApiToForm(latest.data));
        }
      }
    },
    onError: () => {
      showToast("error", t(localizationConstants.settingsSaveErrorToast));
    },
  });

  const routingRuleValues = useMemo(() => {
    return routingRules.map((rule) => ({
      ...rule,
      checked:
        rule.id === "category-region"
          ? form.routing.matchByCategoryRegion
          : rule.id === "company-rating"
            ? form.routing.considerCompanyRating
            : form.routing.prioritizeResponseRate,
    }));
  }, [form.routing]);

  const reminderRuleValues = useMemo(() => {
    return reminderRules.map((rule) => ({
      ...rule,
      checked: rule.id === "watch-48" ? form.notifications.sendReminder : form.notifications.notifyOwner,
    }));
  }, [form.notifications]);

  const defaultOwnerEmailError = validateEmail(
    form.defaultOwnerEmail,
    t(localizationConstants.leadSettingsInvalidEmail)
  );
  const escalationEmailError = form.notifications.escalate
    ? validateEmail(
        form.notifications.escalationEmail,
        t(localizationConstants.leadSettingsInvalidEmail)
      )
    : "";
  const hasEmailValidationError = Boolean(
    defaultOwnerEmailError || escalationEmailError
  );

  const handleSave = () => {
    if (hasEmailValidationError) return;
    updateMutation.mutate(mapFormToApi(form));
  };

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">
          <Translate text={localizationConstants.settingsTitle} />
        </h1>
        <Button
          type="button"
          className="h-10 bg-slate-900 px-5 text-white hover:bg-slate-800"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          <Translate text={localizationConstants.save} />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LeadSettingsTabValue)}>
        <TabsList
          variant="line"
          className="w-full justify-start gap-3 border-b border-slate-200 p-0"
        >
          {leadSettingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-fit flex-none px-6 py-3 text-sm"
            >
              <Translate text={tab.labelKey} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pipeline" className="pt-6">
          <PipelineStagesSection
            mode={form.mode}
            onModeChange={(stageId, value) => {
              if (form.mode[stageId] === value) return;
              setPendingModeChange({ stageId, value });
            }}
            reshipmentDays={form.monitorDaysForReshipment}
            onReshipmentDaysChange={(value) =>
              setForm((prev) => ({
                ...prev,
                monitorDaysForReshipment: value,
              }))
            }
            scheduleByStage={form.scheduleByStage}
            onScheduleTimeChange={(stageId, dayId, time) =>
              setForm((prev) => ({
                ...prev,
                scheduleByStage: {
                  ...prev.scheduleByStage,
                  [stageId]: prev.scheduleByStage[stageId].map((day) =>
                    day.id === dayId ? { ...day, time } : day
                  ),
                },
              }))
            }
            onDayToggle={(stageId, dayId, next) =>
              setForm((prev) => ({
                ...prev,
                scheduleByStage: {
                  ...prev.scheduleByStage,
                  [stageId]: prev.scheduleByStage[stageId].map((day) =>
                    day.id === dayId
                      ? { ...day, time: next ? day.time || "08:00" : "" }
                      : day
                  ),
                },
              }))
            }
          />
        </TabsContent>

        <TabsContent value="categories" className="pt-6">
          <CategoriesSection />
        </TabsContent>

        <TabsContent value="routing" className="pt-6">
          <RoutingRulesSection
            rules={routingRuleValues}
            onRuleToggle={(id, next) =>
              setForm((prev) => ({
                ...prev,
                routing: {
                  ...prev.routing,
                  matchByCategoryRegion:
                    id === "category-region" ? next : prev.routing.matchByCategoryRegion,
                  considerCompanyRating:
                    id === "company-rating" ? next : prev.routing.considerCompanyRating,
                  prioritizeResponseRate:
                    id === "response-rate" ? next : prev.routing.prioritizeResponseRate,
                },
              }))
            }
            maxCompanies={form.maxCompanies}
            onMaxCompaniesChange={(value) =>
              setForm((prev) => ({ ...prev, maxCompanies: value }))
            }
            defaultOwnerEmail={form.defaultOwnerEmail}
            onDefaultOwnerEmailChange={(value) =>
              setForm((prev) => ({ ...prev, defaultOwnerEmail: value }))
            }
            defaultOwnerEmailError={defaultOwnerEmailError}
          />
        </TabsContent>

        <TabsContent value="notifications" className="pt-6">
          <NotificationsSection
            rules={reminderRuleValues}
            onRuleToggle={(id, next) =>
              setForm((prev) => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  sendReminder: id === "watch-48" ? next : prev.notifications.sendReminder,
                  notifyOwner: id === "notify-owner" ? next : prev.notifications.notifyOwner,
                },
              }))
            }
            escalate={form.notifications.escalate}
            onEscalateChange={(next) =>
              setForm((prev) => ({
                ...prev,
                notifications: { ...prev.notifications, escalate: next },
              }))
            }
            escalationEmail={form.notifications.escalationEmail}
            onEscalationEmailChange={(value) =>
              setForm((prev) => ({
                ...prev,
                notifications: { ...prev.notifications, escalationEmail: value },
              }))
            }
            escalationEmailError={escalationEmailError}
          />
        </TabsContent>

        <TabsContent value="permissions" className="pt-6">
          <PermissionsSection />
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={Boolean(pendingModeChange)}
        onOpenChange={(open) => {
          if (!open) setPendingModeChange(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Translate text={localizationConstants.modeSwitchTitle} />
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              {pendingModeChange?.value === "manual"
                ? t(localizationConstants.switchToManualDescription)
                : t(localizationConstants.switchToAutomaticDescription)}
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Translate text={localizationConstants.cancelLabel} />
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-slate-900 text-white hover:bg-slate-900/90"
              onClick={() => {
                if (!pendingModeChange) return;
                setForm((prev) => ({
                  ...prev,
                  mode: {
                    ...prev.mode,
                    [pendingModeChange.stageId]: pendingModeChange.value,
                  },
                }));
                setPendingModeChange(null);
              }}
            >
              <Translate text={localizationConstants.save} />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
