import { useState } from "react";
import type { ToolDetail } from "@/types/tools-suppliers";
import { Button } from "@/components/ui/button";
import { Settings, Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ToolSettingsTabProps {
  tool: ToolDetail;
}

export function ToolSettingsTab({ tool }: ToolSettingsTabProps) {
  const t = useTranslate();
  const [apiKey, setApiKey] = useState(tool.apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [syncFreq, setSyncFreq] = useState(tool.syncFrequency || "daily");
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopyWebhook = () => {
    if (tool.webhookUrl) {
      void navigator.clipboard.writeText(tool.webhookUrl);
      setWebhookCopied(true);
      toast.success("Webhook-URL kopierad!");
      setTimeout(() => setWebhookCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Inställningar sparade!");
    }, 600);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white flex flex-col gap-6">
      <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-1 flex items-center gap-2">
        <Settings className="w-4 h-4 text-slate-500" />
        {t(localizationConstants.toolSettingsTitle)}
      </h3>

      <div className="flex flex-col gap-4">
        {/* API Key */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="apiKey"
            className="text-xs text-slate-600 font-medium"
          >
            {t(localizationConstants.toolApiKeyLabel)}
          </label>
          <div className="flex gap-2 relative">
            <input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Webhook URL */}
        {tool.webhookUrl && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="webhookUrl"
              className="text-xs text-slate-600 font-medium"
            >
              {t(localizationConstants.toolWebhookLabel)}
            </label>
            <div className="flex gap-2">
              <input
                id="webhookUrl"
                readOnly
                value={tool.webhookUrl}
                className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-1 text-sm shadow-sm transition-colors bg-slate-50 text-slate-500 focus-visible:outline-none"
              />
              <Button
                onClick={handleCopyWebhook}
                className="h-10 border border-slate-200 hover:bg-slate-50 px-3 shrink-0 rounded-md flex items-center justify-center bg-transparent transition-colors"
              >
                {webhookCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Sync Frequency */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="syncFreq"
            className="text-xs text-slate-600 font-medium"
          >
            {t(localizationConstants.toolSyncFreqLabel)}
          </label>
          <select
            id="syncFreq"
            value={syncFreq}
            onChange={(e) =>
              setSyncFreq(e.target.value as "hourly" | "daily" | "weekly")
            }
            className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none hover:bg-slate-50/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[1rem_1rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10 cursor-pointer"
          >
            <option value="hourly">
              {t(localizationConstants.toolSyncHour)}
            </option>
            <option value="daily">
              {t(localizationConstants.toolSyncDay)}
            </option>
            <option value="weekly">
              {t(localizationConstants.toolSyncWeek)}
            </option>
          </select>
        </div>

        {/* Save button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-10 bg-[#FF8100] hover:bg-[#E07200] text-white font-medium px-6 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? t(localizationConstants.toolSaving)
              : t(localizationConstants.toolSaveSettings)}
          </Button>
        </div>
      </div>
    </div>
  );
}
