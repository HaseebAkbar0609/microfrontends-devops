"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { sv, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import {
	ArrowLeft,
	Calendar as CalendarIcon,
	Loader2,
	UserPlus,
	UserRoundMinus,
} from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import type {
	PersonnelScheduleItem,
	PlanningAssignee,
	PlanningStatus,
} from "../../types/planning.types";

const personnelTaskSchema = z.object({
	orderNr: z.string().optional(),
	projectName: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	status: z.enum(["completed", "in_progress", "not_started", "waiting", "cancelled", "due"]).optional(),
}).refine(
	(data) => {
		if (data.startTime && data.endTime) {
			const [startH, startM] = data.startTime.split(":").map(Number);
			const [endH, endM] = data.endTime.split(":").map(Number);
			if (!isNaN(startH) && !isNaN(endH)) {
				const startMinutes = startH * 60 + (startM || 0);
				const endMinutes = endH * 60 + (endM || 0);
				return endMinutes > startMinutes;
			}
		}
		return true;
	},
	{
		message: "planningValidationEndTimeBeforeStart",
		path: ["endTime"],
	}
);

export type PersonnelTaskFormValues = z.infer<typeof personnelTaskSchema>;

export interface PersonnelTaskFormData {
	title: string;
	employeeId: string;
	dayStart: number;
	daySpan: number;
	colorTheme: "yellow" | "blue" | "purple" | "pink" | "green" | "light-purple" | "light-yellow" | "red";
	status: PlanningStatus;
	timeRange?: string;
	dateText?: string;
	assignees?: PlanningAssignee[];
}

interface PersonnelCreateTaskModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem: PersonnelScheduleItem | null;
	onSave: (data: PersonnelTaskFormData) => Promise<void>;
	isSaving: boolean;
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	daysHeader: { dayNumber: number; dayNameKey: string }[];
}

function calculateHoursDifference(startTime?: string, endTime?: string): number {
	if (!startTime || !endTime) return 0;
	try {
		const [startH, startM] = startTime.split(":").map(Number);
		const [endH, endM] = endTime.split(":").map(Number);
		if (!isNaN(startH) && !isNaN(endH)) {
			let totalMinutes = endH * 60 + (endM || 0) - (startH * 60 + (startM || 0));
			if (totalMinutes < 0) totalMinutes += 24 * 60;
			return Math.round((totalMinutes / 60) * 10) / 10;
		}
	} catch {
		// fallback
	}
	return 0;
}

export function PersonnelCreateTaskModal({
	isOpen,
	onOpenChange,
	editingItem,
	onSave,
	isSaving,
	employeesList,
}: PersonnelCreateTaskModalProps) {
	const t = useTranslate();
	const { i18n } = useTranslation();
	const isSv = i18n.language === "sv";

	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [isStartDateOpen, setIsStartDateOpen] = useState(false);
	const [isEndDateOpen, setIsEndDateOpen] = useState(false);

	const [selectedUserToAddId, setSelectedUserToAddId] = useState<string>("");
	const [assigneeStartTime, setAssigneeStartTime] = useState("");
	const [assigneeEndTime, setAssigneeEndTime] = useState("");
	const [assignedUsers, setAssignedUsers] = useState<PlanningAssignee[]>([]);
	const [userTimes, setUserTimes] = useState<Record<string, { start: string; end: string }>>({});

	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors },
	} = useForm<PersonnelTaskFormValues>({
		resolver: zodResolver(personnelTaskSchema),
		defaultValues: {
			orderNr: "",
			projectName: "",
			startTime: "",
			endTime: "",
			status: "in_progress",
		},
	});

	const formStartTime = watch("startTime");
	const formEndTime = watch("endTime");

	const totalHours = useMemo(() => {
		return calculateHoursDifference(assigneeStartTime || formStartTime, assigneeEndTime || formEndTime);
	}, [assigneeStartTime, assigneeEndTime, formStartTime, formEndTime]);

	const formatDateDisplay = (date: Date) => {
		const dayName = format(date, "EEEE", { locale: isSv ? sv : enUS });
		const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
		const rest = format(date, "d MMM, yyyy", { locale: isSv ? sv : enUS });
		return `${capitalizedDay} ${rest}`;
	};

	useEffect(() => {
		if (isOpen) {
			if (editingItem) {
				const parts = editingItem.title.split(" - ");
				const orderPart = parts[0]?.replace(/Order\s*/i, "").trim() || "";
				const projectPart = parts[1]?.trim() || parts[0]?.trim() || "";

				reset({
					orderNr: orderPart,
					projectName: projectPart,
					startTime: "10:00",
					endTime: "18:00",
					status: editingItem.status || "in_progress",
				});
				setStartDate(new Date(2025, 11, editingItem.dayStart || 10));
				setEndDate(new Date(2025, 11, (editingItem.dayStart || 10) + (editingItem.daySpan || 1) - 1));
				setAssignedUsers(editingItem.assignees || []);
				setAssigneeStartTime("10:00");
				setAssigneeEndTime("18:00");
				const times: Record<string, { start: string; end: string }> = {};
				(editingItem.assignees || []).forEach((a) => {
					times[a.id] = { start: "10:00", end: "18:00" };
				});
				setUserTimes(times);
			} else {
				reset({
					orderNr: "",
					projectName: "",
					startTime: "",
					endTime: "",
					status: "in_progress",
				});
				setStartDate(undefined);
				setEndDate(undefined);
				setAssigneeStartTime("");
				setAssigneeEndTime("");
				setAssignedUsers([]);
				setSelectedUserToAddId("");
				setUserTimes({});
			}
		}
	}, [isOpen, editingItem, reset]);

	const handleAddAssignee = () => {
		if (!selectedUserToAddId) return;
		const emp = employeesList.find((e) => e.id === selectedUserToAddId);
		if (!emp) return;

		const exists = assignedUsers.some((u) => u.id === emp.id);
		if (exists) return;

		const newAssignee: PlanningAssignee = {
			id: emp.id,
			name: emp.name,
			initials: emp.initials,
			avatarUrl: emp.avatarUrl,
			hours: totalHours || 8,
		};
		setAssignedUsers((prev) => [...prev, newAssignee]);
		setUserTimes((prev) => ({
			...prev,
			[emp.id]: {
				start: assigneeStartTime || formStartTime || "10:00",
				end: assigneeEndTime || formEndTime || "18:00",
			},
		}));
		setSelectedUserToAddId("");
	};

	const handleRemoveAssignee = (id: string) => {
		setAssignedUsers((prev) => prev.filter((u) => u.id !== id));
		setUserTimes((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});
	};

	const onFormSubmit = async (values: PersonnelTaskFormValues) => {
		if (!startDate) {
			showToast("error", t(localizationConstants.planningValidationStartDateRequired));
			return;
		}

		if (assignedUsers.length === 0) {
			showToast("error", t(localizationConstants.planningValidationAssigneeRequired));
			return;
		}

		const orderNr = values.orderNr?.trim();
		const projectName = values.projectName?.trim();
		const title = orderNr
			? projectName
				? `Order ${orderNr} - ${projectName}`
				: `Order ${orderNr}`
			: projectName || "Planering";

		const dayStart = startDate.getDate();
		const daySpan = endDate ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) : 1;
		const employeeId = assignedUsers[0]?.id || employeesList[0]?.id || "emp-1";

		const calculatedTimeRange = (values.startTime && values.endTime)
			? `${values.startTime} - ${values.endTime} (${calculateHoursDifference(
				values.startTime,
				values.endTime
			)} tim)`
			: undefined;

		try {
			await onSave({
				title,
				employeeId,
				dayStart,
				daySpan,
				colorTheme: "blue",
				status: values.status || "in_progress",
				timeRange: calculatedTimeRange,
				dateText: formatDateDisplay(startDate),
				assignees: assignedUsers,
			});

			onOpenChange(false);
		} catch (err) {
			showToast("error", err instanceof Error ? err.message : t(localizationConstants.planningCreateError));
		}
	};

	return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-135 md:max-w-145 p-0 font-sans flex flex-col bg-white overflow-hidden shadow-2xl border-l border-slate-200"
      >
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col h-full"
        >
          {/* ── Sheet Header matching Figma ── */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-md p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-black stroke-2" />
              </Button>
              <SheetTitle className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                <Translate
                  text={
                    editingItem
                      ? localizationConstants.editPlan
                      : localizationConstants.createNewPlan
                  }
                />
              </SheetTitle>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="h-8 sm:h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-md transition-colors cursor-pointer border-0 shadow-none"
              >
                <Translate text={localizationConstants.cancelButton} />
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-8 sm:h-9 px-3 sm:px-4 bg-zinc-900 hover:bg-black text-white font-medium text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-none"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin stroke-[1.33]" />
                ) : (
                  <Translate
                    text={
                      editingItem
                        ? localizationConstants.save
                        : localizationConstants.skapaNy
                    }
                  />
                )}
              </Button>
            </div>
          </div>

          {/* ── Sheet Form Body ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
            {/* Row 1: Order nr & Projekt namn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="orderNr"
                  className="font-sans font-medium text-[14px] leading-5 text-slate-900"
                >
                  <Translate text={localizationConstants.orderNr} />
                </Label>
                <Input
                  id="orderNr"
                  {...register("orderNr")}
                  placeholder={t(localizationConstants.enterNr)}
                  className="h-10 rounded-md border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="projectName"
                  className="font-sans font-medium text-[14px] leading-5 text-slate-900"
                >
                  <Translate text={localizationConstants.projektNamn} />
                </Label>
                <Input
                  id="projectName"
                  {...register("projectName")}
                  placeholder={
                    t(localizationConstants.enterNamn)
                  }
                  className="h-10 rounded-md border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Row 2: Start datum & Slut datum (Interactive Date Picker via Shadcn Popover & Calendar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                  <Translate text={localizationConstants.startDatum} />
                </Label>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3 border-slate-200 bg-white text-xs sm:text-sm shadow-none hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900",
                        !startDate ? "text-muted-foreground" : "text-slate-900",
                        !startDate && "border-red-300",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground stroke-[1.33] shrink-0" />
                      <span className="truncate">
                        {startDate ? (
                          formatDateDisplay(startDate)
                        ) : (
                          <Translate text={localizationConstants.chooseDate} />
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-slate-200 shadow-xl z-10000"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => {
                        setStartDate(d);
                        setIsStartDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                  <Translate text={localizationConstants.slutDatum} />
                </Label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 px-3 border-slate-200 bg-white text-xs sm:text-sm shadow-none hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900",
                        !endDate ? "text-muted-foreground" : "text-slate-900",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground stroke-[1.33] shrink-0" />
                      <span className="truncate">
                        {endDate ? (
                          formatDateDisplay(endDate)
                        ) : (
                          <Translate text={localizationConstants.chooseDate} />
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-slate-200 shadow-xl z-10000"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => {
                        setEndDate(d);
                        setIsEndDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 3: Starttid & Sluttid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="startTime"
                  className="font-sans font-medium text-[14px] leading-5 text-slate-900"
                >
                  <Translate text={localizationConstants.startTid} />
                </Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      id="startTime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t(localizationConstants.chooseTime)}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="endTime"
                  className="font-sans font-medium text-[14px] leading-5 text-slate-900"
                >
                  <Translate text={localizationConstants.slutTid} />
                </Label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      id="endTime"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t(localizationConstants.chooseTime)}
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.endTime.message === "planningValidationEndTimeBeforeStart"
                      ? t(localizationConstants.planningValidationEndTimeBeforeStart)
                      : errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Status Dropdown (Half Width) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="status"
                  className="font-sans font-medium text-[14px] leading-5 text-slate-900"
                >
                  <Translate text={localizationConstants.status} />
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="status"
                        className="h-10 rounded-md border-slate-200 text-xs sm:text-sm text-slate-800 bg-white w-full"
                      >
                        <SelectValue
                          placeholder={
t(localizationConstants.selectStatus)
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 rounded-md shadow-xl font-sans">
                        <SelectItem
                          value="in_progress"
                          className="text-xs cursor-pointer"
                        >
                          <Translate
                            text={localizationConstants.planningInProgress}
                          />
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="text-xs cursor-pointer"
                        >
                          <Translate
                            text={localizationConstants.planningCompleted}
                          />
                        </SelectItem>
                        <SelectItem
                          value="not_started"
                          className="text-xs cursor-pointer"
                        >
                          <Translate
                            text={localizationConstants.planningNotStarted}
                          />
                        </SelectItem>
                        <SelectItem
                          value="waiting"
                          className="text-xs cursor-pointer"
                        >
                          <Translate
                            text={localizationConstants.planningWaiting}
                          />
                        </SelectItem>
                        <SelectItem
                          value="cancelled"
                          className="text-xs cursor-pointer"
                        >
                          <Translate
                            text={localizationConstants.planningCancelled}
                          />
                        </SelectItem>
                        <SelectItem
                          value="due"
                          className="text-xs cursor-pointer"
                        >
                          <Translate text={localizationConstants.planningDue} />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="hidden sm:block" />
            </div>

            {/* Divider Line above Assignee */}
            <div className="border-t border-slate-200 my-4" />

            {/* ── Assignee Section Container ── */}
            <div className="space-y-3 pt-0">
              <h3 className="font-sans font-medium text-[14px] leading-5 tracking-normal text-zinc-950">
                <Translate text={localizationConstants.planningAssignee} />
              </h3>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3.5">
                {/* Top Row: User Select + Add Button */}
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedUserToAddId}
                    onValueChange={setSelectedUserToAddId}
                  >
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-xs sm:text-sm text-slate-700 flex-1 rounded-md">
                      <SelectValue
                        placeholder={t(localizationConstants.addUsers)}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 rounded-md shadow-xl font-sans max-h-48">
                      {employeesList.map((emp) => (
                        <SelectItem
                          key={emp.id}
                          value={emp.id}
                          className="text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {emp.avatarUrl ? (
                              <Image
                                src={emp.avatarUrl}
                                alt={emp.name}
                                width={18}
                                height={18}
                                className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center justify-center shrink-0">
                                {emp.initials}
                              </div>
                            )}
                            <span>{emp.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAssignee}
                    disabled={!selectedUserToAddId}
                    className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-800 rounded-md flex items-center gap-1.5 shrink-0 shadow-none cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-zinc-500 stroke-[1.33]" />
                    <Translate text={localizationConstants.add} />
                  </Button>
                </div>

                {/* Bottom Row: Starttid, Sluttid, Total tim */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                      <Translate text={localizationConstants.startTid} />
                    </Label>
                    <TimePicker
                      value={assigneeStartTime}
                      onChange={setAssigneeStartTime}
                      placeholder={t(localizationConstants.chooseTime)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                      <Translate text={localizationConstants.slutTid} />
                    </Label>
                    <TimePicker
                      value={assigneeEndTime}
                      onChange={setAssigneeEndTime}
                      placeholder={t(localizationConstants.chooseTime)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                      <Translate text={localizationConstants.totalTim} />
                    </Label>
                    <Input
                      disabled
                      value={
                        totalHours
                          ? `${totalHours} ${t(localizationConstants.timmarSuffix)}`
                          : "-"
                      }
                      className="h-10 text-xs sm:text-sm rounded-md bg-slate-100/80 border-slate-200 text-slate-600 font-medium text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Users List - Each as separate gray box */}
              {assignedUsers.length > 0 && (
                <div className="space-y-3">
                  {assignedUsers.map((user) => {
                    const times = userTimes[user.id] || {
                      start: "10:00",
                      end: "18:00",
                    };
                    const userHours = calculateHoursDifference(
                      times.start,
                      times.end,
                    );
                    return (
                      <div
                        key={user.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3.5"
                      >
                        {/* User Select + Delete Button Row */}
                        <div className="flex items-center gap-2">
                          <Select defaultValue={user.id}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 text-[14px] font-normal leading-5 text-slate-700 flex-1 rounded-md font-sans">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  {user.avatarUrl ? (
                                    <Image
                                      src={user.avatarUrl}
                                      alt={user.name}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
                                      {user.initials}
                                    </div>
                                  )}
                                  <span className="font-sans font-normal text-[14px] leading-5 text-slate-700">
                                    {user.name}
                                  </span>
                                  <span className="font-sans font-normal text-[14px] leading-5 text-zinc-500">
                                    @{user.name.split(" ")[0]?.toLowerCase()}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 rounded-md shadow-xl font-sans max-h-48">
                              {employeesList.map((emp) => (
                                <SelectItem
                                  key={emp.id}
                                  value={emp.id}
                                  className="text-[14px] font-normal leading-5 cursor-pointer font-sans"
                                >
                                  <div className="flex items-center gap-2">
                                    {emp.avatarUrl ? (
                                      <Image
                                        src={emp.avatarUrl}
                                        alt={emp.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
                                        {emp.initials}
                                      </div>
                                    )}
                                    <span>{emp.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemoveAssignee(user.id)}
                            className="w-25 h-9 bg-white border border-slate-200 hover:bg-slate-50 text-[14px] font-medium text-slate-900 rounded-md flex items-center justify-center gap-2 shadow-none cursor-pointer"
                          >
                            <UserRoundMinus className="w-4 h-4 text-slate-800 stroke-2" />
                            <Translate
                              text={localizationConstants.deleteLabel}
                            />
                          </Button>
                        </div>

                        {/* Time Inputs Row */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                              <Translate
                                text={localizationConstants.startTid}
                              />
                            </Label>
                            <TimePicker
                              value={times.start}
                              onChange={(val) =>
                                setUserTimes((prev) => ({
                                  ...prev,
                                  [user.id]: {
                                    ...prev[user.id],
                                    start: val,
                                  },
                                }))
                              }
                              placeholder={t(localizationConstants.chooseTime)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                              <Translate text={localizationConstants.slutTid} />
                            </Label>
                            <TimePicker
                              value={times.end}
                              onChange={(val) =>
                                setUserTimes((prev) => ({
                                  ...prev,
                                  [user.id]: {
                                    ...prev[user.id],
                                    end: val,
                                  },
                                }))
                              }
                              placeholder={t(localizationConstants.chooseTime)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="font-sans font-medium text-[14px] leading-5 text-slate-900">
                              <Translate
                                text={localizationConstants.totalTim}
                              />
                            </Label>
                            <Input
                              disabled
                              value={
                                userHours
                                  ? `${userHours} ${t(localizationConstants.timmarSuffix)}`
                                  : "-"
                              }
                              className="h-10 text-[14px] font-normal leading-5 font-sans rounded-md bg-slate-100/80 border-slate-200 text-slate-600 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {assignedUsers.length === 0 && (
                <p className="text-xs text-red-500">
                  <Translate text={localizationConstants.planningValidationAssigneeRequired} />
                </p>
              )}
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default PersonnelCreateTaskModal;
