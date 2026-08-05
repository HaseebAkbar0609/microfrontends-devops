"use client";

import { useState } from "react";
import { MoreVertical, Mail, MailOpen, CheckCircle2, ChevronUp, CirclePlus, Search } from "lucide-react";
import Image from "next/image";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectMarketDetail, QAStatus, QAMessage } from "../types/projectMarket";

const BADGE_COLOR_MAP: Record<string, string> = {
  UE: "bg-blue-600",
  Beställare: "bg-emerald-600",
  Fråga: "bg-yellow-500",
};

function RoleBadge({ badge }: { badge: string }) {
  const colorClass = BADGE_COLOR_MAP[badge] ?? "bg-slate-500";
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium text-white ${colorClass}`}>
      {badge}
    </span>
  );
}

function QACard({ message }: { message: QAMessage }) {
  const t = useTranslate();
  const [comment, setComment] = useState("");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Image src="/assets/images/Avatar.svg" alt={message.sender} width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-zinc-950">{message.sender}</span>
              {message.badge && <RoleBadge badge={message.badge} />}
            </div>
            <span className="text-xs text-slate-500">{message.role}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100" aria-label={t(localizationConstants.actions)}>
              <MoreVertical size={16} aria-hidden={true} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem className="cursor-pointer text-xs">{t(localizationConstants.b2bPMQAMarkAsRead)}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs">{t(localizationConstants.b2bDealArchiveAction)}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-xs text-red-600 focus:text-red-600">{t(localizationConstants.b2bDealDelete)}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-950">{message.message}</p>
        <span className="shrink-0 text-xs text-slate-400">{message.date}</span>
      </div>

      <div className="my-4 h-px bg-slate-200" />

      <div className="flex flex-col gap-3">
        {message.replyFrom && (
          <div className="flex items-center gap-2">
            <Image src="/assets/images/Avatar.svg" alt={message.replyFrom} width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
            <span className="text-sm font-semibold text-zinc-950">{message.replyFrom}</span>
          </div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t(localizationConstants.b2bPMQALeaveComment)}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          rows={3}
        />
        <div className="flex items-center justify-end gap-2">
          <button type="button" className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-200" onClick={() => setComment("")}>
            {t(localizationConstants.cancel)}
          </button>
          <button
            type="button"
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${comment ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-400"}`}
          >
            {t(localizationConstants.b2bPMQASend)}
          </button>
        </div>
      </div>
    </div>
  );
}

function QAColumn({
  status,
  label,
  icon,
  messages,
  badgeColorClass,
}: {
  status: QAStatus;
  label: string;
  icon: React.ReactNode;
  messages: QAMessage[];
  badgeColorClass: string;
}) {
  const [open, setOpen] = useState(true);
  const items = messages.filter((m) => m.status === status);

  return (
    <div className="flex min-w-72 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button type="button" className="flex w-full cursor-pointer items-center gap-3 bg-slate-100 px-4 py-4">
            <div className="flex flex-1 items-center gap-2">
              {icon}
              <span className="text-base font-medium text-zinc-950">{label}</span>
              {items.length > 0 && (
                <span className={`flex h-5 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-medium text-white ${badgeColorClass}`}>
                  {String(items.length).padStart(2, "0")}
                </span>
              )}
            </div>
            <ChevronUp
              size={16}
              className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
              aria-hidden={true}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-4 p-4">
            {items.map((msg) => <QACard key={msg.id} message={msg} />)}
            {items.length === 0 && <p className="py-4 text-center text-xs text-slate-400">—</p>}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function ProjectMarketQATab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();
  const [qaSearch, setQaSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  const uniqueRoles = Array.from(new Set(data.qa.map((q) => q.role)));
  const uniqueBadges = Array.from(new Set(data.qa.flatMap((q) => (q.badge ? [q.badge] : []))));
  const hasActiveFilters = qaSearch !== "" || selectedRoles.length > 0 || selectedBadges.length > 0;

  const filteredQA = data.qa.filter((q) => {
    const matchesSearch = !qaSearch || q.sender.toLowerCase().includes(qaSearch.toLowerCase()) || q.message.toLowerCase().includes(qaSearch.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(q.role);
    const matchesBadge = selectedBadges.length === 0 || (q.badge != null && selectedBadges.includes(q.badge));
    return matchesSearch && matchesRole && matchesBadge;
  });

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden={true} />
          <input
            type="text"
            value={qaSearch}
            onChange={(e) => setQaSearch(e.target.value)}
            placeholder={t(localizationConstants.search)}
            className="h-9 w-56 border-0 border-b border-slate-200 bg-transparent pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <CirclePlus size={13} className="shrink-0 text-slate-400" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQAForetag)}</span>
              {selectedRoles.length > 0 && (
                <><span className="h-3.5 w-px bg-slate-300" />{selectedRoles.map((r) => <span key={r} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">{r}</span>)}</>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs font-medium text-slate-500">{t(localizationConstants.b2bPMQAForetag)}</DropdownMenuLabel>
            {uniqueRoles.map((role) => (
              <DropdownMenuCheckboxItem key={role} checked={selectedRoles.includes(role)} onCheckedChange={(checked) => setSelectedRoles((prev) => checked ? [...prev, role] : prev.filter((r) => r !== role))} className="cursor-pointer text-xs">
                {role}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <CirclePlus size={13} className="shrink-0 text-slate-400" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQAKund)}</span>
              {selectedBadges.length > 0 && (
                <><span className="h-3.5 w-px bg-slate-300" />{selectedBadges.map((b) => <span key={b} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">{b}</span>)}</>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel className="text-xs font-medium text-slate-500">{t(localizationConstants.b2bPMQAKund)}</DropdownMenuLabel>
            {uniqueBadges.map((badge) => (
              <DropdownMenuCheckboxItem key={badge} checked={selectedBadges.includes(badge)} onCheckedChange={(checked) => setSelectedBadges((prev) => checked ? [...prev, badge] : prev.filter((b) => b !== badge))} className="cursor-pointer text-xs">
                {badge}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <button type="button" onClick={() => { setQaSearch(""); setSelectedRoles([]); setSelectedBadges([]); }} className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
            {t(localizationConstants.b2bPMQAReset)} ×
          </button>
        )}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <QAColumn status="new" label={t(localizationConstants.b2bPMQANew)} icon={<Mail size={20} className="shrink-0 text-slate-700" aria-hidden={true} />} messages={filteredQA} badgeColorClass="bg-orange-600" />
        <QAColumn status="opened" label={t(localizationConstants.b2bPMQAOpened)} icon={<MailOpen size={20} className="shrink-0 text-slate-700" aria-hidden={true} />} messages={filteredQA} badgeColorClass="bg-blue-600" />
        <QAColumn status="answered" label={t(localizationConstants.b2bPMQAAnswered)} icon={<CheckCircle2 size={20} className="shrink-0 text-emerald-600" aria-hidden={true} />} messages={filteredQA} badgeColorClass="bg-emerald-600" />
      </div>
    </div>
  );
}
