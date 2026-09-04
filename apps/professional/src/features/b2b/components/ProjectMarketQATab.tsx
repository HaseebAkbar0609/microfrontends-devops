"use client";

import React, { useState } from "react";
import {
  Mail,
  MailOpen,
  CheckCheck,
  ChevronDown,
  PlusCircle,
  X,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
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
import { QAThreadCard, type QAThreadLabels } from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import { ProjectMarketDetail, QAStatus, QAMessage } from "../types/projectMarket";

/**
 * The labels this feature already shipped. Passed through so moving onto the
 * shared card cannot change a single word of what renders here.
 */
const QA_LABELS: QAThreadLabels = {
  markAsRead: localizationConstants.b2bPMQAMarkAsRead,
  archive: localizationConstants.b2bPMQAArkivera,
  delete: localizationConstants.b2bPMQARadera,
  leaveComment: localizationConstants.b2bPMQALeaveComment,
  send: localizationConstants.b2bPMQASend,
  cancel: localizationConstants.cancel,
  answerBadge: localizationConstants.b2bPMQAAdmin,
  answerSubLabel: localizationConstants.b2bPMQAYou,
  badges: {
    UE: localizationConstants.b2bPMQAUE,
    "Beställare": localizationConstants.b2bPMQABestallare,
    "Fråga": localizationConstants.b2bPMQAFraga,
  },
};

/** The card kept these as literals; they stay literal here, not in the shared component. */
const QA_FALLBACK_USER = "Stefan Eriksson";
const QA_FALLBACK_ANSWER = "Hej, jag skickar över den via KMA-modulen";

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
  const items = messages.filter((m) => m.status === status);

  return (
    <QAThreadColumn
      label={label}
      icon={icon}
      className={className}
      // This board only ever badged the New column, so the count is passed
      // only where a badgeNumber was. The shared column derives the figure
      // rather than taking the hard-coded string this file used.
      count={badgeNumber ? items.length : 0}
    >
      {items.map((msg) => (
        <QAThreadCard
          key={msg.id}
          message={{
            id: msg.id,
            sender: msg.sender,
            company: msg.company,
            role: msg.role,
            badge: msg.badge,
            message: msg.message,
            date: msg.date,
            answered: msg.status === "answered",
            answerUser: msg.answerUser || QA_FALLBACK_USER,
            answerBadge: undefined,
            answerText: msg.answerText || msg.replyText || QA_FALLBACK_ANSWER,
            answerDate: msg.answerDate || msg.date,
            replyText: msg.replyText,
          }}
          labels={QA_LABELS}
          currentUserName={msg.replyFrom || QA_FALLBACK_USER}
          onSendReply={onSendReply}
          onMarkAsRead={onMarkAsRead}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </QAThreadColumn>
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
