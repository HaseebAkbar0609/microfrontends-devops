import type { ToolDetail } from "@/types/tools-suppliers";
import { Link, Globe, Info } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ToolOverviewTabProps {
  tool: ToolDetail;
}

export function ToolOverviewTab({ tool }: ToolOverviewTabProps) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-6">
      {/* About the integration */}
      <div className="border border-slate-200 rounded-lg p-5 bg-white">
        <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          {t(localizationConstants.toolAboutSection)}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Website and category details */}
      <div className="border border-slate-200 rounded-lg p-5 bg-white flex flex-col gap-4">
        <h3 className="text-base font-semibold text-[#0A0A0A] tracking-tight mb-1 flex items-center gap-2">
          <Link className="w-4 h-4 text-slate-500" />
          {t(localizationConstants.toolLinksSection)}
        </h3>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-slate-500">
              {t(localizationConstants.toolCategoryLabel)}
            </p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">
              {tool.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">
              {t(localizationConstants.toolWebsiteLabel)}
            </p>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#FF8100] hover:underline flex items-center gap-1 mt-0.5"
            >
              {tool.name}
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
