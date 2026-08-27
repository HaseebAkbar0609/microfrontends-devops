"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Mail,
  MailOpen,
  CheckCheck,
  CircleCheckBig,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  X,
  Archive,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectMarketDetail, QAStatus, QAMessage } from "../types/projectMarket";

function RoleBadge({ badge }: { badge: string }) {
  const t = useTranslate();
  const badgeClasses: Record<string, string> = {
    UE: "bg-blue-600 text-white",
    Beställare: "bg-teal-600 text-white",
    Fråga: "bg-amber-500 text-white",
  };

  const badgeLabels: Record<string, string> = {
    UE: t(localizationConstants.b2bPMQAUE),
    Beställare: t(localizationConstants.b2bPMQABestallare),
    Fråga: t(localizationConstants.b2bPMQAFraga),
  };

  const colorClass = badgeClasses[badge] ?? "bg-slate-600 text-white";
  const label = badgeLabels[badge] ?? badge;

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${colorClass}`}
    >
      {label}
    </span>
  );
}

function QACard({
  message,
  onSendReply,
  onMarkAsRead,
  onArchive,
  onDelete,
}: {
  message: QAMessage;
  onSendReply: (id: string, text: string) => void;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslate();
  const [comment, setComment] = useState(message.replyText ?? "");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs">
      {/* Top message header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <Image
              src="/assets/images/Avatar.svg"
              alt={message.sender}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">{message.sender}</span>
              {message.badge && <RoleBadge badge={message.badge} />}
            </div>
            <span className="text-[11px] text-slate-500">{message.company || message.role}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-800 hover:bg-slate-100 data-[state=open]:bg-slate-200 transition-colors p-0"
              aria-label={t(localizationConstants.actions)}
            >
              <MoreVertical size={16} className="text-slate-800" aria-hidden={true} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => onMarkAsRead(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <CircleCheckBig size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQAMarkAsRead)}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onArchive(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Archive size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQAArkivera)}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Trash2 size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQARadera)}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message question content & date on right under 3 dots */}
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-950">{message.message}</p>
        <span className="shrink-0 font-sans text-xs font-normal leading-4 tracking-normal text-slate-500 text-right">{message.date}</span>
      </div>

      {/* Bottom reply / answer section */}
      {message.status === "answered" ? (
        <div className="mt-3.5 border-t border-slate-100 pt-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
              SE
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                  {message.answerUser || "Stefan Eriksson"}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                  {t(localizationConstants.b2bPMQAAdmin)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                {t(localizationConstants.b2bPMQAYou)}
              </span>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-950">
                  {message.answerText || message.replyText || "Hej, jag skickar över den via KMA-modulen"}
                </p>
                <span className="shrink-0 font-sans text-xs font-normal leading-4 tracking-normal text-slate-500 text-right">
                  {message.answerDate || message.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
              SE
            </div>
            <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
              {message.replyFrom || "Stefan Eriksson"}
            </span>
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(localizationConstants.b2bPMQALeaveComment)}
            className="w-full resize-y rounded-lg border border-slate-200 p-2.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-950 placeholder:text-slate-500 focus:border-slate-300 focus:outline-none min-h-[70px] bg-white shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
            rows={3}
          />

          <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
            {t(localizationConstants.b2bPMQALeaveComment)}
          </span>

          <div className="flex items-center justify-end gap-2 pt-1 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setComment("")}
              className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans font-medium text-[14px] leading-[20px] tracking-normal transition-colors shadow-none ${comment.trim()
                  ? "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200"
                  : "cursor-default bg-slate-100 text-slate-400"
                }`}
            >
              {t(localizationConstants.cancel)}
            </Button>
            <Button
              type="button"
              disabled={!comment.trim()}
              onClick={() => {
                if (comment.trim()) {
                  onSendReply(message.id, comment.trim());
                  setComment("");
                }
              }}
              className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans font-medium text-[14px] leading-[20px] tracking-normal transition-colors ${comment.trim()
                  ? "cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
            >
              {t(localizationConstants.b2bPMQASend)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function QAColumn({
  status,
  label,
  icon,
  messages,
  badgeNumber,
  className,
  onSendReply,
  onMarkAsRead,
  onArchive,
  onDelete,
}: {
  status: QAStatus;
  label: string;
  icon: React.ReactNode;
  messages: QAMessage[];
  badgeNumber?: string;
  className?: string;
  onSendReply: (id: string, text: string) => void;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const items = messages.filter((m) => m.status === status);

  return (
    <div className={cn("flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs", className)}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 hover:bg-slate-200/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-sm font-semibold text-slate-900">{label}</span>
              {badgeNumber && (
                <span className="flex h-4 items-center justify-center rounded bg-orange-600 px-1.5 text-[10px] font-bold text-white">
                  {badgeNumber}
                </span>
              )}
            </div>
            <ChevronUp
              size={16}
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"
                }`}
              aria-hidden={true}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3.5 bg-white p-3.5">
            {items.map((msg) => (
              <QACard
                key={msg.id}
                message={msg}
                onSendReply={onSendReply}
                onMarkAsRead={onMarkAsRead}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
            {items.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">—</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function ProjectMarketQATab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();
  const [qaMessages, setQaMessages] = useState<QAMessage[]>(data.qa);
  const [qaSearch, setQaSearch] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([
    "Fastighetsbolaget",
    "Pelles Måleri",
  ]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["UE", "Supplier"]);

  function handleSendReply(messageId: string, replyText: string) {
    setQaMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: "answered" as const,
              answerText: replyText,
              answerUser: "Stefan Eriksson",
              answerDate: "Idag",
            }
          : msg
      )
    );
    showToast("success", t(localizationConstants.b2bPMQASend));
  }

  function handleMarkAsRead(messageId: string) {
    setQaMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "opened" as const } : msg
      )
    );
    showToast("success", t(localizationConstants.b2bPMQAMarkAsRead));
  }

  function handleArchive(messageId: string) {
    setQaMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showToast("success", t(localizationConstants.b2bPMQAArkivera));
  }

  function handleDelete(messageId: string) {
    setQaMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showToast("success", t(localizationConstants.b2bPMQARadera));
  }

  const allCompanies = Array.from(
    new Set(qaMessages.map((q) => (q.company ? q.company.split(":")[0].trim() : q.role)))
  );
  const allRoles = ["UE", "Supplier", "Beställare", "Fråga"];

  const filteredQA = qaMessages.filter((q) => {
    const matchesSearch =
      !qaSearch ||
      q.sender.toLowerCase().includes(qaSearch.toLowerCase()) ||
      q.message.toLowerCase().includes(qaSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-3 pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 py-3.5 w-full">
      {/* Top Filter Controls */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Search and Filter dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Reusable Search Component */}
          <Search
            value={qaSearch}
            onChange={(val) => setQaSearch(val)}
            placeholder={localizationConstants.search}
            wrapperClassName="w-full sm:w-72 flex-shrink-0"
            className="h-10 text-xs bg-white"
          />

          {/* Reusable Filter dropdown button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-2xs justify-between cursor-pointer shrink-0"
              >
                <Translate text={localizationConstants.filter} />
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white shadow-lg border border-slate-200 rounded-lg">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                <Translate text={localizationConstants.filter} />
              </DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Translate text={localizationConstants.b2bPMQAForetag} />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Translate text={localizationConstants.b2bPMQAKund} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Row 2: Filter Tag Pills (Dashed border, rounded-md, h-9 / 36px height) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter tag: + Företag */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <PlusCircle size={14} className="text-slate-700 shrink-0" aria-hidden={true} />
                <span>{t(localizationConstants.b2bPMQAForetag)}</span>
                {selectedCompanies.length > 0 && (
                  <>
                    <div className="h-4 w-px bg-slate-200 shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {selectedCompanies.map((c) => (
                        <span
                          key={c}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-900"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 bg-white shadow-lg border border-slate-200 rounded-lg">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                {t(localizationConstants.b2bPMQAForetag)}
              </DropdownMenuLabel>
              {allCompanies.map((comp) => (
                <DropdownMenuCheckboxItem
                  key={comp}
                  checked={selectedCompanies.includes(comp)}
                  onCheckedChange={(checked) =>
                    setSelectedCompanies((prev) =>
                      checked ? [...prev, comp] : prev.filter((c) => c !== comp)
                    )
                  }
                  className="cursor-pointer text-xs"
                >
                  {comp}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Filter tag: + Kund */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <PlusCircle size={14} className="text-slate-700 shrink-0" aria-hidden={true} />
                <span>{t(localizationConstants.b2bPMQAKund)}</span>
                {selectedRoles.length > 0 && (
                  <>
                    <div className="h-4 w-px bg-slate-200 shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {selectedRoles.map((r) => (
                        <span
                          key={r}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-900"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 bg-white shadow-lg border border-slate-200 rounded-lg">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                {t(localizationConstants.b2bPMQAKund)}
              </DropdownMenuLabel>
              {allRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={(checked) =>
                    setSelectedRoles((prev) =>
                      checked ? [...prev, role] : prev.filter((r) => r !== role)
                    )
                  }
                  className="cursor-pointer text-xs"
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Filter tag: + Status */}
          <Button
            variant="outline"
            className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <PlusCircle size={14} className="text-slate-700 shrink-0" aria-hidden={true} />
            <span>{t(localizationConstants.b2bPMQAStatus)}</span>
          </Button>

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Reset button with dark Lucide X */}
          <Button
            variant="ghost"
            onClick={() => {
              setQaSearch("");
              setSelectedCompanies([]);
              setSelectedRoles([]);
            }}
            className="flex h-9 cursor-pointer items-center gap-1.5 px-2.5 text-xs font-medium text-slate-900 hover:text-red-600 hover:bg-slate-100 transition-colors"
          >
            <span className="font-semibold text-slate-900">{t(localizationConstants.b2bPMQAReset)}</span>
            <X size={14} className="text-slate-900 shrink-0 stroke-[2.5]" aria-hidden={true} />
          </Button>
        </div>
      </div>

      {/* 3 Kanban Columns — responsive grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full max-w-[1160px] pt-1">
        {/* Column 1: New */}
        <QAColumn
          status="new"
          label={t(localizationConstants.b2bPMQANew)}
          icon={<Mail size={18} className="text-slate-900" aria-hidden={true} />}
          badgeNumber="02"
          messages={filteredQA}
          onSendReply={handleSendReply}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />

        {/* Column 2: Opened */}
        <QAColumn
          status="opened"
          label={t(localizationConstants.b2bPMQAOpened)}
          icon={<MailOpen size={18} className="text-slate-900" aria-hidden={true} />}
          messages={filteredQA}
          onSendReply={handleSendReply}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />

        {/* Column 3: Answered — spans full width (2 cols) when in 2-column mode */}
        <QAColumn
          status="answered"
          label={t(localizationConstants.b2bPMQAAnswered)}
          icon={<CheckCheck size={18} className="text-slate-900" aria-hidden={true} />}
          messages={filteredQA}
          className="md:col-span-2 xl:col-span-1"
          onSendReply={handleSendReply}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
