"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { leadSettingsTabs } from "@/features/leads/settings/constants";
import type { LeadSettingsTabValue } from "@/features/leads/settings/types";
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
	monitorDaysForReshipment: string;
	routing: {
		matchByCategoryRegion: boolean;
		considerCompanyRating: boolean;
		prioritizeResponseRate: boolean;
	};
	maxCompanies: number;
	defaultOwnerEmail: string;
	isActive: boolean;
};

const DEFAULT_OWNER_EMAIL = "ava.wright@gmail.com";
const DEFAULT_MAX_COMPANIES = 5;
const DEFAULT_RESHIPMENT_DAYS = "14";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string, invalidMessage: string): string {
	const normalized = value.trim();
	if (!normalized) return "";
	return EMAIL_PATTERN.test(normalized) ? "" : invalidMessage;
}

function buildDefaultForm(): LeadSettingsForm {
	return {
		monitorDaysForReshipment: DEFAULT_RESHIPMENT_DAYS,
		routing: {
			matchByCategoryRegion: false,
			considerCompanyRating: false,
			prioritizeResponseRate: false,
		},
		maxCompanies: DEFAULT_MAX_COMPANIES,
		defaultOwnerEmail: DEFAULT_OWNER_EMAIL,
		isActive: true,
	};
}

function mapApiToForm(apiData: LeadSettingsApiData | null): LeadSettingsForm {
	const fallback = buildDefaultForm();
	if (!apiData) return fallback;

	return {
		...fallback,
		id: apiData.id ?? fallback.id,
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
		isActive: apiData.is_active ?? fallback.isActive,
	};
}

function mapFormToApi(form: LeadSettingsForm): LeadSettingsApiData {
	return {
		id: form.id,
		monitor_days_for_reshipment: Number(form.monitorDaysForReshipment),
		match_by_category_region: form.routing.matchByCategoryRegion,
		consider_company_rating: form.routing.considerCompanyRating,
		prioritize_response_rate: form.routing.prioritizeResponseRate,
		max_companies: form.maxCompanies,
		default_owner_email: form.defaultOwnerEmail,
		is_active: form.isActive,
	};
}

export function LeadSettingsTab() {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState<LeadSettingsTabValue>("pipeline");
  const [form, setForm] = useState<LeadSettingsForm>(() => buildDefaultForm());
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


  const defaultOwnerEmailError = validateEmail(
    form.defaultOwnerEmail,
    t(localizationConstants.leadSettingsInvalidEmail)
  );
  const hasEmailValidationError = Boolean(defaultOwnerEmailError);

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
          className="h-10 gap-2 bg-slate-900 px-5 text-white hover:bg-slate-800"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          <Image src="/assets/icons/save.svg" alt="" width={16} height={16} />
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
          <PipelineStagesSection />
        </TabsContent>

        <TabsContent value="categories" className="pt-6">
          <CategoriesSection />
        </TabsContent>

        <TabsContent value="routing" className="pt-6">
          <RoutingRulesSection
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
          <NotificationsSection />
        </TabsContent>

        <TabsContent value="permissions" className="pt-6">
          <PermissionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
