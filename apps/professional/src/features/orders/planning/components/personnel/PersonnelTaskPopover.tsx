"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronDown, PenLine, Trash2, X } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type {
  PersonnelScheduleItem,
  PlanningStatus,
  PlanningAssignee,
} from "../../types/planning.types";
import { MOCK_PERSONNEL_SAMPLE_ASSIGNEES } from "../../data/personnelPlanning.mock";

interface PersonnelTaskPopoverProps {
  item: PersonnelScheduleItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: PersonnelScheduleItem) => void;
  onDelete: (itemId: string) => void;
  onAddAssignee: (
    item: PersonnelScheduleItem,
    assignee: PlanningAssignee,
  ) => void;
  employeesList: {
    id: string;
    name: string;
    initials: string;
    avatarUrl?: string;
  }[];
  children: React.ReactNode;
}

const DEFAULT_MOCK_ASSIGNEES: PlanningAssignee[] =
  MOCK_PERSONNEL_SAMPLE_ASSIGNEES;

function getStatusLabelKey(status: PlanningStatus): string {
  switch (status) {
    case "completed":
      return localizationConstants.planningCompleted;
    case "in_progress":
      return localizationConstants.planningInProgress;
    case "not_started":
      return localizationConstants.planningNotStarted;
    case "waiting":
      return localizationConstants.planningWaiting;
    case "cancelled":
      return localizationConstants.planningCancelled;
    case "due":
      return localizationConstants.planningDue;
    default:
      return localizationConstants.planningCompleted;
  }
}

function getPopoverThemeBorder(
  theme?: PersonnelScheduleItem["colorTheme"],
): string {
  switch (theme) {
    case "yellow":
      return "border-l-[6px] border-yellow-600";
    case "purple":
      return "border-l-[6px] border-purple-600";
    case "blue":
      return "border-l-[6px] border-blue-600";
    case "green":
      return "border-l-[6px] border-emerald-600";
    case "pink":
      return "border-l-[6px] border-pink-600";
    default:
      return "border-l-[6px] border-slate-900";
  }
}

export function PersonnelTaskPopover({
  item,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onAddAssignee,
  employeesList,
  children,
}: PersonnelTaskPopoverProps) {
  const t = useTranslate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<{
    id: string;
    name: string;
    initials: string;
    avatarUrl?: string;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock background scroll on small screens when popup is open
  useEffect(() => {
    if (isOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen, isMobile]);

  const assignees =
    item.assignees && item.assignees.length > 0
      ? item.assignees
      : DEFAULT_MOCK_ASSIGNEES;

  const handleSelectAssigneeFromDropdown = (emp: {
    id: string;
    name: string;
    initials: string;
    avatarUrl?: string;
  }) => {
    setSelectedUserToAdd(emp);
    setIsUserDropdownOpen(false);
    const newAssignee: PlanningAssignee = {
      id: emp.id,
      name: emp.name,
      initials: emp.initials,
      avatarUrl: emp.avatarUrl,
      hours: 4,
    };
    onAddAssignee(item, newAssignee);
  };

  const handleAddClick = () => {
    if (selectedUserToAdd) {
      const newAssignee: PlanningAssignee = {
        id: selectedUserToAdd.id,
        name: selectedUserToAdd.name,
        initials: selectedUserToAdd.initials,
        avatarUrl: selectedUserToAdd.avatarUrl,
        hours: 4,
      };
      onAddAssignee(item, newAssignee);
      setSelectedUserToAdd(null);
    } else if (employeesList.length > 0) {
      const emp = employeesList[0];
      const newAssignee: PlanningAssignee = {
        id: `emp-${Date.now()}`,
        name: emp.name,
        initials: emp.initials,
        avatarUrl: emp.avatarUrl,
        hours: 4,
      };
      onAddAssignee(item, newAssignee);
    }
  };

  const renderCardContent = () => (
    <div
      className={`relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-85 h-auto flex flex-col p-4 pt-2 pb-3 animate-in fade-in zoom-in-95 duration-200 text-slate-900 transition-all duration-200 ${isUserDropdownOpen ? "min-h-[420px]" : ""}`}
    >
      {/* Header with full width edge-to-edge 6px theme border-left */}
      <div
        className={`-mx-4 px-3 flex items-center justify-between pt-1 pb-1 ${getPopoverThemeBorder(item.colorTheme)}`}
      >
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate pr-2">
          {item.title || "Order 5000 - Badrum"}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-md hover:bg-slate-100 transition-colors cursor-pointer hover:text-rose-600 p-0"
            title={t(localizationConstants.remove) || "Delete"}
          >
            <Trash2 className="w-4 h-4 text-zinc-900 stroke-[1.33]" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onOpenChange(false);
              onEdit(item);
            }}
            className="w-8 h-8 rounded-md hover:bg-slate-100 transition-colors cursor-pointer p-0"
            title={t(localizationConstants.redigeraPlanering) || "Edit"}
          >
            <PenLine className="w-4 h-4 text-zinc-900 stroke-[1.33]" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-md hover:bg-slate-100 transition-colors cursor-pointer p-0"
            title={t(localizationConstants.actionClose) || "Close"}
          >
            <X className="w-4 h-4 text-zinc-900 stroke-[1.33]" />
          </Button>
        </div>
      </div>

      {/* Status Pill */}
      <div className="mt-2 mb-2">
        <span className="w-20 h-5 px-2 py-0.5 rounded border border-emerald-500 bg-emerald-100 text-emerald-800 font-sans font-medium text-[12px] leading-4 tracking-normal text-center inline-flex items-center justify-center gap-1 shrink-0 truncate">
          <Translate text={getStatusLabelKey(item.status)} />
        </span>
      </div>

      {/* Date & Time Info */}
      <div className="space-y-0.5 font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
        <div>{item.timeRange || "10:00 - 18:00 (8 tim)"}</div>
        <div>{item.dateText || "Måndag 10 Dec, 2025"}</div>
      </div>

      {/* Full Width Divider Line */}
      <div className="-mx-4 my-3 border-t border-slate-200" />

      {/* Assignees Section */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-sans font-medium text-[14px] leading-5 tracking-normal text-slate-900">
          <Translate text={localizationConstants.planningAssignee} />
        </h4>

        {/* Add Assignee Control */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <DropdownMenu
              open={isUserDropdownOpen}
              onOpenChange={setIsUserDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 px-3 bg-white border-slate-200 rounded-md text-xs text-slate-500 flex items-center justify-between hover:bg-slate-50 focus:outline-none transition-colors cursor-pointer font-normal shadow-none"
                >
                  <span className="truncate">
                    {selectedUserToAdd
                      ? selectedUserToAdd.name
                      : t(localizationConstants.addUsers) ||
                        "Lägg till användare"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-50 min-w-50 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl p-1 z-10000 font-sans"
              >
                {employeesList.map((emp) => (
                  <DropdownMenuItem
                    key={emp.id}
                    onClick={() => handleSelectAssigneeFromDropdown(emp)}
                    className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {emp.avatarUrl ? (
                        <Image
                          src={emp.avatarUrl}
                          alt={emp.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-100 text-slate-600 font-semibold text-[9px] flex items-center justify-center shrink-0">
                          {emp.initials}
                        </div>
                      )}
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {emp.name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleAddClick}
            className="h-9 px-3.5 bg-zinc-100 hover:bg-slate-200 rounded-md text-xs font-medium text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-none border-0"
          >
            <Translate text={localizationConstants.add} />
          </Button>
        </div>

        {/* Assignees List with smooth vertical scroll */}
        <div className="space-y-2.5 pt-1 max-h-62.5 overflow-y-auto pr-1">
          {assignees.map((user, idx) => (
            <div
              key={`${user.id}-${idx}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <span className="w-4.75 h-5 font-sans font-medium text-[14px] leading-5 tracking-normal text-center text-zinc-500 flex items-center justify-center">
                      {user.initials}
                    </span>
                  </div>
                )}
                <span className="font-sans font-medium text-[14px] leading-5 tracking-normal text-slate-900 truncate">
                  {user.name}
                </span>
              </div>

              <span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500 shrink-0">
                {user.hours}{" "}
                <Translate text={localizationConstants.timmarSuffix} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (isMobile) {
    return (
      <>
        {children}
        {mounted &&
          isOpen &&
          createPortal(
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-transparent font-sans">
              <div
                className="fixed inset-0 cursor-pointer"
                onClick={() => onOpenChange(false)}
              />
              <div className="relative z-10 w-full max-w-85 flex justify-center">
                {renderCardContent()}
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        collisionPadding={{ top: 90, bottom: 24, left: 16, right: 16 }}
        avoidCollisions={true}
        className="w-83 min-w-83 max-w-83 p-0 border-0 bg-transparent shadow-none z-50 font-sans"
      >
        {renderCardContent()}
      </PopoverContent>
    </Popover>
  );
}

export default PersonnelTaskPopover;
