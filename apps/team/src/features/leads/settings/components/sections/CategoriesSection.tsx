"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SettingsCard } from "@/features/leads/settings/components/common/SettingsCard";
import { ToggleSwitch } from "@/features/leads/settings/components/common/ToggleSwitch";
import { useState } from "react";
import { categoryItems } from "@/features/leads/settings/constants";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

export function CategoriesSection() {
  const t = useTranslate();
  const [items, setItems] = useState(categoryItems);

  const toggleItem = (id: string, next: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: next } : item
      )
    );
  };

  return (
    <div className="mb-10">
    <SettingsCard
      titleKey={localizationConstants.workCategoriesTitle}
      action={
        <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.addCategoryLabel} />
        </Button>
      }
    >
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <ToggleSwitch
                checked={item.isActive}
                onChange={(next) => toggleItem(item.id, next)}
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  <Translate text={item.nameKey} />
                </div>
                <div className="text-xs text-slate-500">
                  <Translate text={localizationConstants.activeLabel} />
                </div>
              </div>
            </div>
            <ConfirmDialog
              title={t(localizationConstants.deleteCategoryTitle)}
              description={t(localizationConstants.deleteCategoryDescription)}
              confirmText={t(localizationConstants.delete)}
              cancelText={t(localizationConstants.cancelLabel)}
              onConfirm={() =>
                setItems((prev) => prev.filter((row) => row.id !== item.id))
              }
              trigger={
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              }
            />
          </div>
        ))}
      </div>
    </SettingsCard>
    </div>
  );
}
