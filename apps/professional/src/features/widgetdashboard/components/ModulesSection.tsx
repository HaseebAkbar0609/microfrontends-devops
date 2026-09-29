"use client";

import Link from "next/link";
import { Folders, ArrowUpRight, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuthStatus, type User } from "@/context/AuthContext";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WidgetLoadingState, WidgetErrorState, WidgetEmptyState } from "./WidgetContent";
import { getHomeModules, homeModuleApp } from "../services/homeModules";

export const ModulesSection = () => {
  const { company, user, isReady } = useAuthStatus();
  const t = useTranslate();
  const { i18n } = useTranslation();
  const companyId = company?.id ?? "";
  const actorId = (user as User | null)?.id ?? "";
  const query = useQuery({ queryKey: ["home-modules", companyId, actorId],
    queryFn: () => getHomeModules(companyId), enabled: isReady && Boolean(companyId && actorId),
    retry: false, staleTime: 60_000 });
  return (
    <section aria-labelledby="home-modules-title" className="min-w-0 border-t border-slate-200 py-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 id="home-modules-title" className="flex min-w-0 items-center gap-2 text-lg font-semibold">
          <Folders size={20} className="shrink-0 text-slate-600" aria-hidden="true" />
          <Translate text={localizationConstants.modulesTitle} />
        </h2>
        <button type="button" aria-label={t(localizationConstants.homeModulesRefresh)} title={t(localizationConstants.homeModulesRefresh)}
          disabled={!companyId || query.isFetching} onClick={() => void query.refetch()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm hover:bg-slate-100 disabled:opacity-50">
          <RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} aria-hidden="true" />
        </button>
      </header>
      {!isReady || query.isLoading ? <WidgetLoadingState rows={3} /> : query.isError || !query.data ?
        <WidgetErrorState message={localizationConstants.widgetDataLoadError} /> : !query.data.length ? <WidgetEmptyState /> : (
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {query.data.map(group => (
              <div key={group.category} className="min-w-0">
                <h3 className="mb-2 break-words text-xs font-semibold text-slate-500">{group.category}</h3>
                <ul className="space-y-1">
                  {group.modules.map(module => {
                    const app = homeModuleApp(module, t);
                    const label = i18n.language.startsWith("sv") ? module.name_sv || module.name : module.name;
                    const Icon = app?.icon ?? Folders;
                    const content = <><Icon className="h-4 w-4 shrink-0 text-slate-500" /><span className="min-w-0 flex-1 break-words">{label}</span></>;
                    return <li key={module.id}>{app ? (
                      <Link href={app.href} className="flex min-h-11 min-w-0 items-center gap-2 py-2 pr-2 text-sm hover:underline">
                        {content}<ArrowUpRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
                      </Link>
                    ) : <div className="flex min-h-11 min-w-0 items-center gap-2 py-2 text-sm text-slate-500">{content}</div>}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
    </section>
  );
};
