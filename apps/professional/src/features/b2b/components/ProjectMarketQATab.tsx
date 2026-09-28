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
import { Textarea } from "@/components/ui/textarea";
import { useAuthStatus } from "@/context/AuthContext";
import {
  markProjectMarketQuestionReadAction,
  postProjectMarketQuestionAction,
} from "@/api-actions/b2b/projectMarket";
import { formatApiDateTime } from "@/utils/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
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
  // No answer chip or "You": any engaged company's user can answer, and the
  // payload does not say who that was relative to the viewer — a fixed
  // "Admin" / "You" labelled every answer wrongly.
  badges: {
    UE: localizationConstants.b2bPMQAUE,
    "Beställare": localizationConstants.b2bPMQABestallare,
    "Fråga": localizationConstants.b2bPMQAFraga,
  },
};

type CompanyFilter = "own" | "other";
type RoleFilter = "UE" | "Beställare";

const STATUSES: QAStatus[] = ["new", "opened", "answered"];
const STATUS_LABELS: Record<QAStatus, TranslationKeys> = {
  new: localizationConstants.b2bPMQANew,
  opened: localizationConstants.b2bPMQAOpened,
  answered: localizationConstants.b2bPMQAAnswered,
};
const COMPANY_LABELS: Record<CompanyFilter, TranslationKeys> = {
  own: localizationConstants.b2bPMQAOwnCompany,
  other: localizationConstants.b2bPMQAOtherCompanies,
};

/**
 * Who asked, in the terms the filters use. A bidder's question is from "your
 * company" or from "other companies" — the API never names competitors — and
 * a customer's question belongs to no company.
 */
function companyOf(q: QAMessage): CompanyFilter | null {
  if (q.role !== "professional") return null;
  return q.ownCompany ? "own" : "other";
}

function roleOf(q: QAMessage): RoleFilter | null {
  if (q.role === "professional") return "UE";
  if (q.role === "customer") return "Beställare";
  return null;
}

type FilterOption<T extends string> = { value: T; label: string };

function FilterMenuSection<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onToggle: (value: T, on: boolean) => void;
}) {
  return (
    <>
      <DropdownMenuLabel className="text-xs font-semibold text-slate-500">{label}</DropdownMenuLabel>
      {options.map((o) => (
        <DropdownMenuCheckboxItem
          key={o.value}
          checked={selected.includes(o.value)}
          onCheckedChange={(checked) => onToggle(o.value, checked === true)}
          // Keep the menu open so several values can be picked in one go.
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer text-xs"
        >
          {o.label}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
}

/** A dashed "+ Label" pill that opens its options and lists what is picked. */
function FilterPill<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onToggle: (value: T, on: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <PlusCircle size={14} className="text-slate-700 shrink-0" aria-hidden={true} />
          <span>{label}</span>
          {selected.length > 0 && (
            <>
              <div className="h-4 w-px bg-slate-200 shrink-0" />
              <div className="flex items-center gap-1.5">
                {options
                  .filter((o) => selected.includes(o.value))
                  .map((o) => (
                    <span
                      key={o.value}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-900"
                    >
                      {o.label}
                    </span>
                  ))}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 bg-white shadow-lg border border-slate-200 rounded-lg">
        <FilterMenuSection label={label} options={options} selected={selected} onToggle={onToggle} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function QAColumn({
  status,
  label,
  icon,
  messages,
  className,
  currentUserName,
  onMarkAsRead,
  describeCompany,
}: {
  status: QAStatus;
  label: string;
  icon: React.ReactNode;
  messages: QAMessage[];
  className?: string;
  currentUserName: string;
  onMarkAsRead: (id: string) => void;
  /** The line under the sender's name: their company as the viewer may see it. */
  describeCompany: (q: QAMessage) => string;
}) {
  const items = messages.filter((m) => m.status === status);

  return (
    <QAThreadColumn
      label={label}
      icon={icon}
      className={className}
      count={items.length}
      showCount={true}
    >
      {items.map((msg) => (
        <QAThreadCard
          key={msg.id}
          message={{
            id: msg.id,
            sender: msg.sender,
            company: describeCompany(msg),
            role: msg.role,
            // No role chip: the line under the name already says who asked.
            badge: msg.badge,
            message: msg.message,
            date: formatApiDateTime(msg.date),
            answered: msg.status === "answered",
            answerUser: msg.answerUser,
            answerBadge: msg.answerBadge,
            answerText: msg.answerText || msg.replyText,
            answerDate: formatApiDateTime(msg.answerDate || msg.date),
            replyText: msg.replyText,
          }}
          labels={QA_LABELS}
          currentUserName={currentUserName}
          // Only "Mark as read" is offered, and only on a new question — that is
          // the one move a question can make from here (new → opened). Answering
          // is the Offers screen's job (M2), and archive / delete have no backend
          // endpoint; the shared card renders only the actions a caller handles.
          onMarkAsRead={msg.status === "new" ? onMarkAsRead : undefined}
        />
      ))}
    </QAThreadColumn>
  );
}

export function ProjectMarketQATab({
  data,
  onRefresh,
}: {
  data: ProjectMarketDetail;
  onRefresh?: () => void | Promise<void>;
}) {
  const t = useTranslate();
  const { user } = useAuthStatus() as {
    user: { first_name?: string; last_name?: string; email?: string } | null;
  };
  const currentUserName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "";

  const qaMessages = data.qa;
  const [qaSearch, setQaSearch] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyFilter[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleFilter[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<QAStatus[]>([]);
  const [question, setQuestion] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  async function handleAskQuestion() {
    const text = question.trim();
    if (!text || isPosting) return;

    setIsPosting(true);
    const res = await postProjectMarketQuestionAction(data.id, text);
    if (res.success) {
      setQuestion("");
      showToast("success", t(localizationConstants.b2bPMQAQuestionPosted));
      await onRefresh?.();
    } else {
      showToast("error", res.error || t(localizationConstants.genericError));
    }
    setIsPosting(false);
  }

  async function handleMarkAsRead(messageId: string) {
    const res = await markProjectMarketQuestionReadAction(data.id, messageId);
    if (res.success) {
      showToast("success", t(localizationConstants.b2bPMQAMarkAsRead));
      await onRefresh?.();
    } else {
      showToast("error", res.error || t(localizationConstants.genericError));
    }
  }

  // Only the values present in this thread, in a fixed order.
  const allCompanies = (["own", "other"] as CompanyFilter[]).filter((c) =>
    qaMessages.some((q) => companyOf(q) === c)
  );
  const allRoles = (["UE", "Beställare"] as RoleFilter[]).filter((r) =>
    qaMessages.some((q) => roleOf(q) === r)
  );
  const roleLabel = (r: RoleFilter) => t(QA_LABELS.badges?.[r] ?? localizationConstants.b2bPMQAKund);
  const companyOptions = allCompanies.map((c) => ({ value: c, label: t(COMPANY_LABELS[c]) }));
  const roleOptions = allRoles.map((r) => ({ value: r, label: roleLabel(r) }));
  const statusOptions = STATUSES.map((st) => ({ value: st, label: t(STATUS_LABELS[st]) }));
  const activeFilterCount = selectedCompanies.length + selectedRoles.length + selectedStatuses.length;

  const describeCompany = (q: QAMessage) => {
    const company = companyOf(q);
    if (company) return t(COMPANY_LABELS[company]);
    return q.role === "customer" ? t(localizationConstants.b2bPMQABestallare) : "";
  };

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, value: T, on: boolean) =>
    setter((prev) => (on ? [...prev, value] : prev.filter((v) => v !== value)));

  const filteredQA = qaMessages.filter((q) => {
    const needle = qaSearch.toLowerCase();
    const matchesSearch =
      !qaSearch ||
      q.sender.toLowerCase().includes(needle) ||
      q.message.toLowerCase().includes(needle);
    const company = companyOf(q);
    const role = roleOf(q);
    const matchesCompany =
      selectedCompanies.length === 0 || (company !== null && selectedCompanies.includes(company));
    const matchesRole = selectedRoles.length === 0 || (role !== null && selectedRoles.includes(role));
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(q.status);
    return matchesSearch && matchesCompany && matchesRole && matchesStatus;
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

          {/* Every filter in one menu — the same choices as the pills below */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-2xs justify-between cursor-pointer shrink-0"
              >
                <Translate text={localizationConstants.filter} />
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 bg-white shadow-lg border border-slate-200 rounded-lg">
              <FilterMenuSection
                label={t(localizationConstants.b2bPMQAForetag)}
                options={companyOptions}
                selected={selectedCompanies}
                onToggle={(value, on) => toggle(setSelectedCompanies, value, on)}
              />
              <DropdownMenuSeparator />
              <FilterMenuSection
                label={t(localizationConstants.b2bPMQAKund)}
                options={roleOptions}
                selected={selectedRoles}
                onToggle={(value, on) => toggle(setSelectedRoles, value, on)}
              />
              <DropdownMenuSeparator />
              <FilterMenuSection
                label={t(localizationConstants.b2bPMQAStatus)}
                options={statusOptions}
                selected={selectedStatuses}
                onToggle={(value, on) => toggle(setSelectedStatuses, value, on)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Row 2: Filter Tag Pills (Dashed border, rounded-md, h-9 / 36px height) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterPill
            label={t(localizationConstants.b2bPMQAForetag)}
            options={companyOptions}
            selected={selectedCompanies}
            onToggle={(value, on) => toggle(setSelectedCompanies, value, on)}
          />

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          <FilterPill
            label={t(localizationConstants.b2bPMQAKund)}
            options={roleOptions}
            selected={selectedRoles}
            onToggle={(value, on) => toggle(setSelectedRoles, value, on)}
          />

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          <FilterPill
            label={t(localizationConstants.b2bPMQAStatus)}
            options={statusOptions}
            selected={selectedStatuses}
            onToggle={(value, on) => toggle(setSelectedStatuses, value, on)}
          />

          {/* External Separator Line */}
          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Reset button with dark Lucide X */}
          <Button
            variant="ghost"
            onClick={() => {
              setQaSearch("");
              setSelectedCompanies([]);
              setSelectedRoles([]);
              setSelectedStatuses([]);
            }}
            className="flex h-9 cursor-pointer items-center gap-1.5 px-2.5 text-xs font-medium text-slate-900 hover:text-red-600 hover:bg-slate-100 transition-colors"
          >
            <span className="font-semibold text-slate-900">{t(localizationConstants.b2bPMQAReset)}</span>
            <X size={14} className="text-slate-900 shrink-0 stroke-[2.5]" aria-hidden={true} />
          </Button>
        </div>
      </div>

      {/* Ask a question — posts into the project's shared Q&A thread */}
      <div className="w-full max-w-[1160px] rounded-xl border border-slate-200 bg-white p-4">
        <label
          htmlFor="b2b-qa-question"
          className="mb-2 block text-sm font-semibold text-zinc-950"
        >
          {t(localizationConstants.b2bPMQAAskQuestion)}
        </label>
        <Textarea
          id="b2b-qa-question"
          value={question}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
          placeholder={t(localizationConstants.b2bPMQAQuestionPlaceholder)}
          rows={3}
          className="resize-y text-sm"
        />
        <div className="mt-2.5 flex justify-end">
          <Button
            type="button"
            onClick={handleAskQuestion}
            disabled={!question.trim() || isPosting}
            className="h-9 cursor-pointer bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t(localizationConstants.b2bPMQASend)}
          </Button>
        </div>
      </div>

      {/* 3 Kanban Columns — responsive grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full max-w-[1160px] pt-1">
        {/* Column 1: New */}
        <QAColumn
          status="new"
          label={t(localizationConstants.b2bPMQANew)}
          icon={<Mail size={24} className="text-zinc-950" aria-hidden={true} />}
          messages={filteredQA}
          currentUserName={currentUserName}
          onMarkAsRead={handleMarkAsRead}
          describeCompany={describeCompany}
        />

        {/* Column 2: Opened */}
        <QAColumn
          status="opened"
          label={t(localizationConstants.b2bPMQAOpened)}
          icon={<MailOpen size={24} className="text-zinc-950" aria-hidden={true} />}
          messages={filteredQA}
          currentUserName={currentUserName}
          onMarkAsRead={handleMarkAsRead}
          describeCompany={describeCompany}
        />

        {/* Column 3: Answered — spans full width (2 cols) when in 2-column mode */}
        <QAColumn
          status="answered"
          label={t(localizationConstants.b2bPMQAAnswered)}
          icon={<CheckCheck size={24} className="text-zinc-950" aria-hidden={true} />}
          messages={filteredQA}
          className="md:col-span-2 xl:col-span-1"
          currentUserName={currentUserName}
          onMarkAsRead={handleMarkAsRead}
          describeCompany={describeCompany}
        />
      </div>
    </div>
  );
}
