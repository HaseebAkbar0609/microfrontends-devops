"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import { reshipmentOptions } from "@/features/leads/settings/constants";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { fetchPipelines, updateStage, deleteStage } from "@/features/leads/settings/api/pipelineApi";
import type { PipelineStageApiData, StageMode } from "@/features/leads/settings/types/pipelineApi";
import { showToast } from "@/lib/toast";
import { AddStageModal } from "./AddStageModal";

const DAYS = [
  { id: "mon", labelKey: localizationConstants.mondayLabel as keyof typeof localizationConstants },
  { id: "tue", labelKey: localizationConstants.tuesdayLabel as keyof typeof localizationConstants },
  { id: "wed", labelKey: localizationConstants.wednesdayLabel as keyof typeof localizationConstants },
  { id: "thu", labelKey: localizationConstants.thursdayLabel as keyof typeof localizationConstants },
  { id: "fri", labelKey: localizationConstants.fridayLabel as keyof typeof localizationConstants },
];

const labelNameById: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
};

export function PipelineStagesSection() {
  const t = useTranslate();
  const queryClient = useQueryClient();

  const { data: pipelines, isLoading } = useQuery({
    queryKey: ["pipelines"],
    queryFn: fetchPipelines,
  });

  const mutation = useMutation({
    mutationFn: async ({
      pipelineId,
      stageId,
      payload,
    }: {
      pipelineId: string;
      stageId: string;
      payload: Record<string, unknown>;
    }) => {
      return updateStage(pipelineId, stageId, payload);
    },
    onSuccess: () => {
      showToast("success", t(localizationConstants.settingsSavedToast));
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
    },
    onError: () => {
      showToast("error", t(localizationConstants.settingsSaveErrorToast));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ pipelineId, stageId }: { pipelineId: string; stageId: string }) => {
      return deleteStage(pipelineId, stageId);
    },
    onSuccess: () => {
      showToast("success", "Stage deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
    },
    onError: () => {
      showToast("error", "Failed to delete stage");
    },
  });

  if (isLoading) {
    return <div className="p-4 text-slate-500">Loading pipelines...</div>;
  }

  // Use the first pipeline for now, as we only seeded one "Standard Pipeline"
  const pipeline = pipelines?.[0];
  const stages = pipeline?.stages || [];

  const handleModeChange = (stage: PipelineStageApiData, mode: StageMode) => {
    mutation.mutate({
      pipelineId: pipeline!.id,
      stageId: stage.id,
      payload: { mode },
    });
  };

  const handleReshipmentChange = (stage: PipelineStageApiData, value: string) => {
    mutation.mutate({
      pipelineId: pipeline!.id,
      stageId: stage.id,
      payload: { reshipment_days: parseInt(value, 10) },
    });
  };

  const handleProbabilityChange = (stage: PipelineStageApiData, value: string) => {
    const probability = Number(value);
    if (!Number.isInteger(probability) || probability < 0 || probability > 100) {
      showToast("error", "Probability must be between 0 and 100");
      return;
    }
    if (probability !== stage.probability) {
      mutation.mutate({ pipelineId: pipeline!.id, stageId: stage.id, payload: { probability } });
    }
  };

  const handleDayToggle = (stage: PipelineStageApiData, dayId: string, checked: boolean) => {
    const label = labelNameById[dayId];
    const currentSchedule = (stage.schedule_config?.additionalProp1 || {}) as Record<string, string>;
    const newSchedule = { ...currentSchedule };

    if (checked) {
      newSchedule[label] = "08:00"; // default time
    } else {
      delete newSchedule[label];
    }

    mutation.mutate({
      pipelineId: pipeline!.id,
      stageId: stage.id,
      payload: { schedule_config: { additionalProp1: newSchedule } },
    });
  };

  const handleTimeChange = (stage: PipelineStageApiData, dayId: string, time: string) => {
    const label = labelNameById[dayId];
    const currentSchedule = (stage.schedule_config?.additionalProp1 || {}) as Record<string, string>;
    const newSchedule = { ...currentSchedule, [label]: time };

    mutation.mutate({
      pipelineId: pipeline!.id,
      stageId: stage.id,
      payload: { schedule_config: { additionalProp1: newSchedule } },
    });
  };

  return (
    <div className="space-y-6 mb-10">
      <SettingsCard titleKey={localizationConstants.stagesTitle}>
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={index > 0 ? "border-t border-slate-200 pt-6" : ""}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {stage.name} {stage.is_default && "(Default)"}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-4">
                      <label className="space-y-1 text-xs font-semibold text-slate-600">
                        <span>Probability (%)</span>
                        <Input
                          key={`${stage.id}-${stage.probability}`}
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          defaultValue={stage.probability}
                          onBlur={(event) => handleProbabilityChange(stage, event.target.value)}
                          onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
                          className="h-9 w-24 border-slate-300"
                          aria-label={`Probability for ${stage.name}`}
                        />
                      </label>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="outline" size="icon" title="Move stage up" aria-label={`Move ${stage.name} up`}
                          disabled={index === 0 || mutation.isPending}
                          onClick={() => mutation.mutate({ pipelineId: pipeline!.id, stageId: stage.id, payload: { order_index: index - 1 } })}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" size="icon" title="Move stage down" aria-label={`Move ${stage.name} down`}
                          disabled={index === stages.length - 1 || mutation.isPending}
                          onClick={() => mutation.mutate({ pipelineId: pipeline!.id, stageId: stage.id, payload: { order_index: index + 1 } })}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  <div className="flex items-center gap-6 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={stage.mode}
                        onValueChange={(value) => handleModeChange(stage, value as StageMode)}
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

                  {stage.name.toLowerCase() === "monitor" && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase text-slate-500">
                        <Translate text={localizationConstants.daysForReshipmentLabel} />
                      </div>
                      <Select
                        value={String(stage.reshipment_days || 14)}
                        onValueChange={(value) => handleReshipmentChange(stage, value)}
                      >
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
                  {stage.mode !== "manual" &&
                    DAYS.map((day) => {
                      const label = labelNameById[day.id];
                      const scheduleMap = (stage.schedule_config?.additionalProp1 || {}) as Record<string, string>;
                      const hasTime = label in scheduleMap;
                      const timeValue = hasTime ? scheduleMap[label] : "";

                      return (
                        <div key={day.id} className="flex items-center gap-4">
                          <div className="flex min-w-[120px] items-center gap-2 text-sm text-slate-700">
                            <Checkbox
                              className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white"
                              checked={hasTime}
                              onCheckedChange={(checked) => handleDayToggle(stage, day.id, Boolean(checked))}
                            />
                            <span>
                              <Translate text={day.labelKey} />
                            </span>
                          </div>
                          <Input
                            type="time"
                            value={timeValue}
                            onChange={(e) => handleTimeChange(stage, day.id, e.target.value)}
                            className="h-10 w-[160px] border-slate-900 text-slate-900 focus-visible:ring-slate-900"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              {stage.is_default ? (
                <div className="flex-shrink-0 pt-0.5 w-8" />
              ) : (
                <div className="flex-shrink-0 pt-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate({ pipelineId: pipeline!.id, stageId: stage.id })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          ))}
          
          <div className="border-t border-slate-200 pt-6">
            {pipeline && <AddStageModal pipelineId={pipeline.id} />}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
