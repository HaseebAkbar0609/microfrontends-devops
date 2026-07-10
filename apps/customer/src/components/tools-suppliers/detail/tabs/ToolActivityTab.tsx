import type { ToolDetail } from "@/types/tools-suppliers";
import { History, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ToolActivityTabProps {
  tool: ToolDetail;
}

export function ToolActivityTab({ tool }: ToolActivityTabProps) {
  const t = useTranslate();
  const logs = tool.activityLogs || [];

  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white flex flex-col gap-6">
      <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-1 flex items-center gap-2">
        <History className="w-4 h-4 text-slate-500" />
        {t(localizationConstants.toolActivityTitle)}
      </h3>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <AlertCircle className="w-8 h-8 opacity-40 text-slate-400" />
          <p className="text-sm">{t(localizationConstants.toolNoActivity)}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="shrink-0 mt-0.5">
                {log.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  {log.message}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
