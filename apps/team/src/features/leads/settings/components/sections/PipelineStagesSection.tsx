"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import { reshipmentOptions, stageSections } from "@/features/leads/settings/constants";
import type { ScheduleDay } from "@/features/leads/settings/types";

type PipelineStagesSectionProps = {
	mode: Record<"review" | "monitor", "automatic" | "manual">;
	onModeChange: (stageId: "review" | "monitor", value: "automatic" | "manual") => void;
	reshipmentDays: string;
	onReshipmentDaysChange: (value: string) => void;
	scheduleByStage: Record<"review" | "monitor", ScheduleDay[]>;
	onScheduleTimeChange: (
		stageId: "review" | "monitor",
		dayId: string,
		time: string
	) => void;
	onDayToggle: (stageId: "review" | "monitor", dayId: string, next: boolean) => void;
};

export function PipelineStagesSection({
	mode,
	onModeChange,
	reshipmentDays,
	onReshipmentDaysChange,
	scheduleByStage,
	onScheduleTimeChange,
	onDayToggle,
}: PipelineStagesSectionProps) {
	const t = useTranslate();

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard titleKey={localizationConstants.stagesTitle}>
        <div className="space-y-6">
          {stageSections.map((section, index) => (
            <div
              key={section.id}
              className={index > 0 ? "border-t border-slate-200 pt-6" : ""}
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      <Translate text={section.titleKey} />
                    </div>
                    {section.subtitleKey && (
                      <div className="text-sm text-slate-500">
                        <Translate text={section.subtitleKey} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={mode[section.id as "review" | "monitor"]}
                        onValueChange={(value) =>
													onModeChange(section.id as "review" | "monitor", value as "automatic" | "manual")
                        }
                        className="flex gap-6"
                      >
                        <label className="flex items-center gap-2">
                          <RadioGroupItem
                            value="automatic"
                            className="text-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <span className="text-sm">
                            <Translate text={localizationConstants.automaticLabel} />
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem
                            value="manual"
                            className="text-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <span className="text-sm">
                            <Translate text={localizationConstants.manualLabel} />
                          </span>
                        </label>
                      </RadioGroup>
                    </div>
                  </div>

                  {section.id === "monitor" && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase text-slate-500">
                        <Translate text={localizationConstants.daysForReshipmentLabel} />
                      </div>
                      <Select value={reshipmentDays} onValueChange={onReshipmentDaysChange}>
                        <SelectTrigger className="w-[160px] border-slate-900 text-slate-900">
                          <SelectValue placeholder={t(localizationConstants.daysLabel)} />
                        </SelectTrigger>
                        <SelectContent>
                          {reshipmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {mode[section.id as "review" | "monitor"] !== "manual" &&
                    scheduleByStage[section.id as "review" | "monitor"].map((day) => (
                      <div key={day.id} className="flex items-center gap-4">
                        <div className="flex min-w-[120px] items-center gap-2 text-sm text-slate-700">
                          <Checkbox
                            className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
                            checked={Boolean(day.time)}
                            onCheckedChange={(checked) =>
                              onDayToggle(
                                section.id as "review" | "monitor",
                                day.id,
                                Boolean(checked)
                              )
                            }
                          />
                          <span>
                            <Translate text={day.labelKey} />
                          </span>
                        </div>
                        <Input
                          type="time"
                          value={day.time}
                          onChange={(event) =>
                            onScheduleTimeChange(
															section.id as "review" | "monitor",
															day.id,
															event.target.value
														)
                          }
                          className="h-10 w-[160px] border-slate-900 text-slate-900 focus-visible:ring-slate-900"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
