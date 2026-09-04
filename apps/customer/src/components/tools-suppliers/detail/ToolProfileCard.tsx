import { Wrench, Globe, LogOut, Layers } from "lucide-react";
import type { ToolDetail } from "@/types/tools-suppliers";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ToolProfileCardProps {
  tool: ToolDetail;
  onDisconnect: () => void;
  onTabChange: (tab: string) => void;
}

export function ToolProfileCard({
  tool,
  onDisconnect,
  onTabChange,
}: ToolProfileCardProps) {
  const [status, setStatus] = useState(tool.status);
  const t = useTranslate();

  const handleDisconnectConfirm = () => {
    setStatus("disconnected");
    onDisconnect();
  };

  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {t(localizationConstants.toolConnectedBadge)}
          </span>
        );
      case "pending":
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg">
            {t(localizationConstants.toolPendingBadge)}
          </span>
        );
      case "disconnected":
      default:
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
            {t(localizationConstants.toolDisconnectedBadge)}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
      {/* Avatar + info wrapper */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Top centered part: logo, status, name */}
        <div className="flex flex-col items-center text-center gap-2 w-full">
          {/* Tool Logo placeholder */}
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-inner">
            <Wrench className="w-8 h-8 text-slate-600" />
          </div>

          {/* Status badges */}
          <div className="flex gap-1 flex-wrap justify-center">
            {getStatusBadge()}
            <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg">
              {t(localizationConstants.toolBadgeText)}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-xl font-semibold text-[#0A0A0A] tracking-tight leading-snug">
            {tool.name}
          </h2>
        </div>

        {/* Non-centered part: category */}
        <div className="text-left w-full">
          <p className="text-sm text-slate-500 mt-0.5">{tool.category}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1.5 mt-1 w-full">
          <Button
            onClick={() => onTabChange("settings")}
            className="w-full h-8 bg-[#1E293B] text-white hover:bg-slate-900 text-[13px] font-medium transition-colors rounded-lg flex items-center justify-center"
          >
            {t(localizationConstants.toolLabelSettings)}
          </Button>

          {status === "connected" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full h-8 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[13px] font-medium transition-colors gap-2 rounded-lg flex items-center justify-center">
                  <LogOut className="w-3.5 h-3.5" />
                  {t(localizationConstants.toolDisconnectAction)}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold text-[#0A0A0A]">
                    {t(localizationConstants.toolDisconnectTitle, {
                      name: tool.name,
                    })}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-slate-500">
                    {t(localizationConstants.toolDisconnectDesc, {
                      name: tool.name,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    {t(localizationConstants.toolDisconnectCancel)}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDisconnectConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    {t(localizationConstants.toolDisconnectAction)}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Contact/Website info */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3.5">
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              {t(localizationConstants.toolWebsiteLabel)}
            </p>
            <a
              href={tool.website}
              className="text-sm text-[#FF8100] hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tool.website}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-slate-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              {t(localizationConstants.toolCategoryLabel)}
            </p>
            <p className="text-sm text-[#0A0A0A]">{tool.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
