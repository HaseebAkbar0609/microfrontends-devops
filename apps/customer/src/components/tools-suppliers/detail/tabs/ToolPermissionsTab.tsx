import type { ToolDetail } from "@/types/tools-suppliers";
import { ShieldCheck, ShieldAlert, BadgeCheck } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ToolPermissionsTabProps {
  tool: ToolDetail;
}

export function ToolPermissionsTab({ tool }: ToolPermissionsTabProps) {
  const t = useTranslate();
  const permissions = tool.permissions || [];

  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white flex flex-col gap-6">
      <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-1 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-500" />
        {t(localizationConstants.toolPermissionsTitle)}
      </h3>

      {permissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <ShieldAlert className="w-8 h-8 opacity-40 text-slate-400" />
          <p className="text-sm">{t(localizationConstants.toolNoPermissions)}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500 mb-2 leading-relaxed">
            {t(localizationConstants.toolPermissionsDesc, { name: tool.name })}
          </p>
          <div className="flex flex-col gap-2">
            {permissions.map((perm) => (
              <div
                key={perm}
                className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100"
              >
                <BadgeCheck className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  {perm}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
