"use client";

import { Loader2, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";

export function AdminQueryState({ loading, error, empty, onRetry }: { loading?: boolean; error?: string; empty?: string; onRetry?: () => void }) {
  const { t } = useTranslation();
  if (!loading && !error && !empty) return null;
  return (
    <div role={error ? "alert" : "status"} className="flex flex-wrap items-center justify-center gap-2 p-4 text-sm text-slate-600">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{t(error ?? (loading ? localizationConstants.adminUsersLoading : empty ?? ""))}</span>
      {error && onRetry && <Button type="button" variant="outline" size="sm" onClick={onRetry}><RotateCw className="mr-2 h-4 w-4" />{t(localizationConstants.adminRetry)}</Button>}
    </div>
  );
}
