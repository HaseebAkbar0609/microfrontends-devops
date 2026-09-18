"use client";

import { useState, useMemo } from "react";
import {
  Info,
  Users,
  BriefcaseBusiness,
  WashingMachine,
  RulerDimensionLine,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  PencilLine,
  Trash2,
  CircleFadingPlus,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../../constants/constructionLog.constants";
import type {
  WorkforceItem,
  ActivityItem,
  MachineItem,
  DeviationItem,
} from "../../types/constructionLog.types";
import type {
  ActivityStatusKey,
  DeviationStatusKey,
  DeviationTypeKey,
} from "../../constants/constructionLog.constants";

interface CreateStep2Props {
  workforce: WorkforceItem[];
  activities: ActivityItem[];
  machines: MachineItem[];
  deviations: DeviationItem[];
  generalNotes: string;
  selfInspectionNote: string;
  errors: Record<string, string>;
  onWorkforceChange: (items: WorkforceItem[]) => void;
  onActivitiesChange: (items: ActivityItem[]) => void;
  onMachinesChange: (items: MachineItem[]) => void;
  onDeviationsChange: (items: DeviationItem[]) => void;
  onGeneralNotesChange: (val: string) => void;
  onSelfInspectionNoteChange: (val: string) => void;
}

export function CreateStep2WorkForce({
  workforce,
  activities,
  machines,
  deviations,
  generalNotes: _generalNotes,
  selfInspectionNote: _selfInspectionNote,
  errors,
  onWorkforceChange,
  onActivitiesChange,
  onMachinesChange,
  onDeviationsChange,
  onGeneralNotesChange: _onGeneralNotesChange,
  onSelfInspectionNoteChange: _onSelfInspectionNoteChange,
}: CreateStep2Props) {
  const t = useTranslate();
  const [wfOpen, setWfOpen] = useState(true);
  const [actOpen, setActOpen] = useState(true);
  const [machOpen, setMachOpen] = useState(true);
  const [devOpen, setDevOpen] = useState(true);

  const [wfRole, setWfRole] = useState("");
  const [wfOwn, setWfOwn] = useState<number>(0);
  const [wfUE, setWfUE] = useState<number>(0);
  const [wfHours, setWfHours] = useState<number>(0);
  const [wfNote, setWfNote] = useState("");

  const [actTitle, setActTitle] = useState("");
  const [actStatus, setActStatus] = useState<string>(
    CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.IN_PROGRESS,
  );
  const [actNote, setActNote] = useState("");

  const [machName, setMachName] = useState("");
  const [machQty, setMachQty] = useState("");
  const [machHours, setMachHours] = useState<number>(0);
  const [machNote, setMachNote] = useState("");

  const [devNumber, setDevNumber] = useState<number>(1);
  const [devType, setDevType] = useState<string>(
    CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA,
  );
  const [devStatus, setDevStatus] = useState<string>(
    CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.IN_PROGRESS,
  );
  const [devNote, setDevNote] = useState("");

  const [wfSortCol, setWfSortCol] = useState<"role" | "own" | null>(null);
  const [wfSortAsc, setWfSortAsc] = useState(true);
  const [actSortCol, setActSortCol] = useState<"title" | "status" | null>(null);
  const [actSortAsc, setActSortAsc] = useState(true);
  const [machSortCol, setMachSortCol] = useState<"name" | null>(null);
  const [machSortAsc, setMachSortAsc] = useState(true);
  const [devSortCol, setDevSortCol] = useState<
    "number" | "type" | "status" | null
  >(null);
  const [devSortAsc, setDevSortAsc] = useState(true);

  const handleWfSort = (col: "role" | "own") => {
    if (wfSortCol === col) {
      setWfSortAsc(!wfSortAsc);
    } else {
      setWfSortCol(col);
      setWfSortAsc(true);
    }
  };
  const handleActSort = (col: "title" | "status") => {
    if (actSortCol === col) {
      setActSortAsc(!actSortAsc);
    } else {
      setActSortCol(col);
      setActSortAsc(true);
    }
  };
  const handleMachSort = (col: "name") => {
    if (machSortCol === col) {
      setMachSortAsc(!machSortAsc);
    } else {
      setMachSortCol(col);
      setMachSortAsc(true);
    }
  };
  const handleDevSort = (col: "number" | "type" | "status") => {
    if (devSortCol === col) {
      setDevSortAsc(!devSortAsc);
    } else {
      setDevSortCol(col);
      setDevSortAsc(true);
    }
  };

  const sortedWorkforce = useMemo(() => {
    const items = [...workforce];
    if (!wfSortCol) return items;
    return items.sort((a, b) => {
      let cmp = 0;
      if (wfSortCol === "role") cmp = a.role.localeCompare(b.role);
      else if (wfSortCol === "own") cmp = (a.ownCount ?? 0) - (b.ownCount ?? 0);
      return wfSortAsc ? cmp : -cmp;
    });
  }, [workforce, wfSortCol, wfSortAsc]);

  const sortedActivities = useMemo(() => {
    const items = [...activities];
    if (!actSortCol) return items;
    return items.sort((a, b) => {
      let cmp = 0;
      if (actSortCol === "title") cmp = a.title.localeCompare(b.title);
      else if (actSortCol === "status") cmp = a.status.localeCompare(b.status);
      return actSortAsc ? cmp : -cmp;
    });
  }, [activities, actSortCol, actSortAsc]);

  const sortedMachines = useMemo(() => {
    const items = [...machines];
    if (!machSortCol) return items;
    return items.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return machSortAsc ? cmp : -cmp;
    });
  }, [machines, machSortCol, machSortAsc]);

  const sortedDeviations = useMemo(() => {
    const items = [...deviations];
    if (!devSortCol) return items;
    return items.sort((a, b) => {
      let cmp = 0;
      if (devSortCol === "number") cmp = a.number - b.number;
      else if (devSortCol === "type") cmp = a.type.localeCompare(b.type);
      else if (devSortCol === "status") cmp = a.status.localeCompare(b.status);
      return devSortAsc ? cmp : -cmp;
    });
  }, [deviations, devSortCol, devSortAsc]);

  const handleAddWorkforce = () => {
    if (!wfRole.trim()) return;
    onWorkforceChange([
      ...workforce,
      {
        id: `wf-${Date.now()}`,
        role: wfRole,
        ownCount: wfOwn || null,
        subcontractorCount: wfUE || null,
        hours: wfHours,
        note: wfNote,
      },
    ]);
    setWfRole("");
    setWfOwn(0);
    setWfUE(0);
    setWfHours(0);
    setWfNote("");
  };
  const handleDeleteWorkforce = (id: string) =>
    onWorkforceChange(workforce.filter((w) => w.id !== id));

  const handleAddActivity = () => {
    if (!actTitle.trim()) return;
    onActivitiesChange([
      ...activities,
      {
        id: `act-${Date.now()}`,
        title: actTitle,
        status: actStatus as ActivityStatusKey,
        note: actNote,
      },
    ]);
    setActTitle("");
    setActStatus(CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.IN_PROGRESS);
    setActNote("");
  };
  const handleDeleteActivity = (id: string) =>
    onActivitiesChange(activities.filter((a) => a.id !== id));

  const handleAddMachine = () => {
    if (!machName.trim()) return;
    onMachinesChange([
      ...machines,
      {
        id: `mach-${Date.now()}`,
        name: machName,
        quantity: machQty,
        hours: machHours,
        note: machNote,
      },
    ]);
    setMachName("");
    setMachQty("");
    setMachHours(0);
    setMachNote("");
  };
  const handleDeleteMachine = (id: string) =>
    onMachinesChange(machines.filter((m) => m.id !== id));

  const handleAddDeviation = () => {
    onDeviationsChange([
      ...deviations,
      {
        id: `dev-${Date.now()}`,
        number: devNumber,
        type: devType as DeviationTypeKey,
        status: devStatus as DeviationStatusKey,
        note: devNote,
      },
    ]);
    setDevNumber(devNumber + 1);
    setDevNote("");
  };
  const handleDeleteDeviation = (id: string) =>
    onDeviationsChange(deviations.filter((d) => d.id !== id));

  const getStatusLabel = (status: string) => {
    if (status === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.IN_PROGRESS)
      return t(localizationConstants.orderDagbokStatusInProgress);
    if (status === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.PENDING)
      return t(localizationConstants.orderDagbokStatusPending);
    return t(localizationConstants.orderDagbokStatusDone);
  };
  const getTypeLabel = (type: string) => {
    if (type === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA)
      return t(localizationConstants.orderDagbokTypeAta);
    if (type === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ERROR)
      return t(localizationConstants.orderDagbokTypeError);
    return t(localizationConstants.orderDagbokTypeObstacle);
  };

  const LG =
    "font-sans text-sm font-medium leading-5 tracking-normal text-slate-900";
  const TD =
    "px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900";
  const TH =
    "px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap";
  const INP = "h-10 border-slate-200 text-sm bg-white text-slate-800";

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
        <div className="flex h-14 min-h-14 w-full items-center border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Info
              className="h-6 w-6 text-slate-800 shrink-0"
              strokeWidth={1.75}
            />
            <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
              <Translate
                text={localizationConstants.orderDagbokSectionDetailed}
              />
            </span>
          </div>
        </div>

        <div className="px-6 pt-6 pb-6 flex flex-col gap-4">
          {/* Workforce */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className="flex h-12 min-h-12 w-full items-center justify-between px-5 py-3 bg-slate-200 cursor-pointer hover:bg-slate-300/60 transition-colors"
              onClick={() => setWfOpen(!wfOpen)}
            >
              <div className="flex items-center gap-2.5">
                <Users
                  className="h-6 w-6 text-slate-900 shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-sm font-semibold text-slate-900">
                  <Translate
                    text={localizationConstants.orderDagbokCardWorkforce}
                  />
                </span>
              </div>
              {wfOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
            {wfOpen && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColRole}
                      />
                    </span>
                    <Select
                      value={wfRole}
                      onValueChange={(val) => setWfRole(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue
                          placeholder={t(
                            localizationConstants.orderDagbokPlaceholderWorkRole,
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem value="Projektledare" className="text-sm">
                          Projektledare
                        </SelectItem>
                        <SelectItem value="Arbetsledare" className="text-sm">
                          Arbetsledare
                        </SelectItem>
                        <SelectItem
                          value="Byggnadssnickare"
                          className="text-sm"
                        >
                          Byggnadssnickare
                        </SelectItem>
                        <SelectItem value="Elektriker" className="text-sm">
                          Elektriker
                        </SelectItem>
                        <SelectItem value="VVS-montör" className="text-sm">
                          VVS-montör
                        </SelectItem>
                        <SelectItem value="Målare" className="text-sm">
                          Målare
                        </SelectItem>
                        <SelectItem value="Kranförare" className="text-sm">
                          Kranförare
                        </SelectItem>
                        <SelectItem
                          value="Anläggningsarbetare"
                          className="text-sm"
                        >
                          Anläggningsarbetare
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColOwn}
                      />
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={wfOwn}
                      onChange={(e) => setWfOwn(Number(e.target.value))}
                      className={INP}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColSubcontractor}
                      />
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={wfUE}
                      onChange={(e) => setWfUE(Number(e.target.value))}
                      className={INP}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColHours}
                      />
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={wfHours}
                      onChange={(e) => setWfHours(Number(e.target.value))}
                      className={INP}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColNote}
                      />
                    </span>
                    <Input
                      value={wfNote}
                      onChange={(e) => setWfNote(e.target.value)}
                      placeholder={t(
                        localizationConstants.orderDagbokPlaceholderWorkName,
                      )}
                      className={INP}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddWorkforce}
                  className="h-10 w-fit gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800 cursor-pointer"
                >
                  <CircleFadingPlus className="h-3.5 w-3.5" />
                  <Translate
                    text={localizationConstants.orderDagbokBtnMoreRows}
                  />
                </Button>
                {errors.workforce && (
                  <p className="text-xs text-red-500">{errors.workforce}</p>
                )}
                {workforce.length > 0 && (
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full table-auto border-collapse">
                      <TableHeader>
                        <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
                          <TableHead className={TH}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWfSort("role")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColRole)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWfSort("own")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColOwn)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Translate
                              text={
                                localizationConstants.orderDagbokColSubcontractor
                              }
                            />
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Translate
                              text={localizationConstants.orderDagbokColHours}
                            />
                          </TableHead>
                          <TableHead className={TH}>
                            <Translate
                              text={localizationConstants.orderDagbokColNote}
                            />
                          </TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {sortedWorkforce.map((item) => (
                          <TableRow
                            key={item.id}
                            className="border-b border-slate-200 transition-colors hover:bg-slate-50/60"
                          >
                            <TableCell className={TD}>{item.role}</TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {item.ownCount ?? "-"}
                            </TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {item.subcontractorCount ?? "-"}
                            </TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {item.hours}
                            </TableCell>
                            <TableCell className={TD}>{item.note}</TableCell>
                            <TableCell className="px-4 py-3.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer rotate-90"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-slate-900" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
                                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900">
                                    <PencilLine className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionEdit,
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteWorkforce(item.id)
                                    }
                                    className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionDelete,
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className="flex h-12 min-h-12 w-full items-center justify-between px-5 py-3 bg-slate-200 cursor-pointer hover:bg-slate-300/60 transition-colors"
              onClick={() => setActOpen(!actOpen)}
            >
              <div className="flex items-center gap-2.5">
                <BriefcaseBusiness
                  className="h-6 w-6 text-slate-900 shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-sm font-semibold text-slate-900">
                  <Translate
                    text={localizationConstants.orderDagbokCardWorks}
                  />
                </span>
              </div>
              {actOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
            {actOpen && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColRole}
                      />
                    </span>
                    <Select
                      value={actTitle}
                      onValueChange={(val) => setActTitle(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue
                          placeholder={t(
                            localizationConstants.orderDagbokPlaceholderWorkDescription,
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem value="Markarbeten" className="text-sm">
                          Markarbeten
                        </SelectItem>
                        <SelectItem value="Grundarbeten" className="text-sm">
                          Grundarbeten
                        </SelectItem>
                        <SelectItem value="Stomarbeten" className="text-sm">
                          Stomarbeten
                        </SelectItem>
                        <SelectItem value="Takarbeten" className="text-sm">
                          Takarbeten
                        </SelectItem>
                        <SelectItem value="Fasadearbeten" className="text-sm">
                          Fasadearbeten
                        </SelectItem>
                        <SelectItem
                          value="Inredningsarbeten"
                          className="text-sm"
                        >
                          Inredningsarbeten
                        </SelectItem>
                        <SelectItem value="Elarbeten" className="text-sm">
                          Elarbeten
                        </SelectItem>
                        <SelectItem value="VVS-arbeten" className="text-sm">
                          VVS-arbeten
                        </SelectItem>
                        <SelectItem value="Finisharbeten" className="text-sm">
                          Finisharbeten
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColStatus}
                      />
                    </span>
                    <Select
                      value={actStatus}
                      onValueChange={(val) => setActStatus(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS
                              .IN_PROGRESS
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={
                              localizationConstants.orderDagbokStatusInProgress
                            }
                          />
                        </SelectItem>
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.DONE
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={localizationConstants.orderDagbokStatusDone}
                          />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColNotes}
                      />
                    </span>
                    <Input
                      value={actNote}
                      onChange={(e) => setActNote(e.target.value)}
                      placeholder={t(
                        localizationConstants.orderDagbokPlaceholderWorkPlace,
                      )}
                      className={INP}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddActivity}
                  className="h-10 w-fit gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800 cursor-pointer"
                >
                  <CircleFadingPlus className="h-3.5 w-3.5" />
                  <Translate
                    text={localizationConstants.orderDagbokBtnMoreRows}
                  />
                </Button>
                {errors.activities && (
                  <p className="text-xs text-red-500">{errors.activities}</p>
                )}
                {activities.length > 0 && (
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full table-auto border-collapse">
                      <TableHeader>
                        <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
                          <TableHead className={`${TH} min-w-[140px]`}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActSort("title")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColRole)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead
                            className={`${TH} text-center min-w-[100px]`}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActSort("status")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColStatus)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} min-w-[160px]`}>
                            <Translate
                              text={localizationConstants.orderDagbokColNotes}
                            />
                          </TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {sortedActivities.map((item) => (
                          <TableRow
                            key={item.id}
                            className="border-b border-slate-200 transition-colors hover:bg-slate-50/60"
                          >
                            <TableCell className={TD}>{item.title}</TableCell>
                            <TableCell className="px-4 py-3.5 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-white">
                                {getStatusLabel(item.status)}
                              </span>
                            </TableCell>
                            <TableCell className={TD}>{item.note}</TableCell>
                            <TableCell className="px-4 py-3.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer rotate-90"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-slate-900" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
                                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900">
                                    <PencilLine className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionEdit,
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteActivity(item.id)
                                    }
                                    className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionDelete,
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Machines */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className="flex h-12 min-h-12 w-full items-center justify-between px-5 py-3 bg-slate-200 cursor-pointer hover:bg-slate-300/60 transition-colors"
              onClick={() => setMachOpen(!machOpen)}
            >
              <div className="flex items-center gap-2.5">
                <WashingMachine
                  className="h-6 w-6 text-slate-900 shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-sm font-semibold text-slate-900">
                  <Translate
                    text={localizationConstants.orderDagbokCardMachines}
                  />
                </span>
              </div>
              {machOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
            {machOpen && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColRole}
                      />
                    </span>
                    <Select
                      value={machName}
                      onValueChange={(val) => setMachName(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue
                          placeholder={t(
                            localizationConstants.orderDagbokPlaceholderMachineName,
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem value="Grävmaskin" className="text-sm">
                          Grävmaskin
                        </SelectItem>
                        <SelectItem value="Hjullastare" className="text-sm">
                          Hjullastare
                        </SelectItem>
                        <SelectItem value="Bulldozer" className="text-sm">
                          Bulldozer
                        </SelectItem>
                        <SelectItem value="Lastbil" className="text-sm">
                          Lastbil
                        </SelectItem>
                        <SelectItem value="Kran" className="text-sm">
                          Kran
                        </SelectItem>
                        <SelectItem value="Dumpervagn" className="text-sm">
                          Dumpervagn
                        </SelectItem>
                        <SelectItem
                          value="Välskakningsplatta"
                          className="text-sm"
                        >
                          Välskakningsplatta
                        </SelectItem>
                        <SelectItem value="Kompressor" className="text-sm">
                          Kompressor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColQuantity}
                      />
                    </span>
                    <Input
                      value={machQty}
                      onChange={(e) => setMachQty(e.target.value)}
                      placeholder={t(
                        localizationConstants.orderDagbokPlaceholderMachineQuantity,
                      )}
                      className={INP}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColHoursShort}
                      />
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={machHours}
                      onChange={(e) => setMachHours(Number(e.target.value))}
                      className={INP}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColNotes}
                      />
                    </span>
                    <Input
                      value={machNote}
                      onChange={(e) => setMachNote(e.target.value)}
                      placeholder={t(
                        localizationConstants.orderDagbokPlaceholderDeviationDescription,
                      )}
                      className={INP}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddMachine}
                  className="h-10 w-fit gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800 cursor-pointer"
                >
                  <CircleFadingPlus className="h-3.5 w-3.5" />
                  <Translate
                    text={localizationConstants.orderDagbokBtnMoreRows}
                  />
                </Button>
                {machines.length > 0 && (
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full table-auto border-collapse">
                      <TableHeader>
                        <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
                          <TableHead className={TH}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMachSort("name")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColRole)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Translate
                              text={
                                localizationConstants.orderDagbokColQuantity
                              }
                            />
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Translate
                              text={
                                localizationConstants.orderDagbokColHoursShort
                              }
                            />
                          </TableHead>
                          <TableHead className={TH}>
                            <Translate
                              text={localizationConstants.orderDagbokColNotes}
                            />
                          </TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {sortedMachines.map((item) => (
                          <TableRow
                            key={item.id}
                            className="border-b border-slate-200 transition-colors hover:bg-slate-50/60"
                          >
                            <TableCell className={TD}>{item.name}</TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {item.quantity}
                            </TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {item.hours}
                            </TableCell>
                            <TableCell className={TD}>{item.note}</TableCell>
                            <TableCell className="px-4 py-3.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer rotate-90"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-slate-900" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
                                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900">
                                    <PencilLine className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionEdit,
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteMachine(item.id)}
                                    className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionDelete,
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deviations */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className="flex h-12 min-h-12 w-full items-center justify-between px-5 py-3 bg-slate-200 cursor-pointer hover:bg-slate-300/60 transition-colors"
              onClick={() => setDevOpen(!devOpen)}
            >
              <div className="flex items-center gap-2.5">
                <RulerDimensionLine
                  className="h-6 w-6 text-slate-900 shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-sm font-semibold text-slate-900">
                  <Translate
                    text={localizationConstants.orderDagbokCardDeviations}
                  />
                </span>
              </div>
              {devOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
            {devOpen && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColNumber}
                      />
                    </span>
                    <Input
                      type="number"
                      min={1}
                      value={devNumber}
                      onChange={(e) => setDevNumber(Number(e.target.value))}
                      className={INP}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColType}
                      />
                    </span>
                    <Select
                      value={devType}
                      onValueChange={(val) => setDevType(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem
                          value={CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA}
                          className="text-sm"
                        >
                          <Translate
                            text={localizationConstants.orderDagbokTypeAta}
                          />
                        </SelectItem>
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ERROR
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={localizationConstants.orderDagbokTypeError}
                          />
                        </SelectItem>
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.OBSTACLE
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={localizationConstants.orderDagbokTypeObstacle}
                          />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColStatus}
                      />
                    </span>
                    <Select
                      value={devStatus}
                      onValueChange={(val) => setDevStatus(val)}
                    >
                      <SelectTrigger className="h-10 w-full text-sm border-slate-200 bg-white text-slate-700 shadow-none cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border border-slate-200 bg-white shadow-md z-50">
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS
                              .IN_PROGRESS
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={
                              localizationConstants.orderDagbokStatusInProgress
                            }
                          />
                        </SelectItem>
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.PENDING
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={
                              localizationConstants.orderDagbokStatusPending
                            }
                          />
                        </SelectItem>
                        <SelectItem
                          value={
                            CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.DONE
                          }
                          className="text-sm"
                        >
                          <Translate
                            text={localizationConstants.orderDagbokStatusDone}
                          />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={LG}>
                      <Translate
                        text={localizationConstants.orderDagbokColNote}
                      />
                    </span>
                    <Input
                      value={devNote}
                      onChange={(e) => setDevNote(e.target.value)}
                      placeholder={t(
                        localizationConstants.orderDagbokPlaceholderDeviationAction,
                      )}
                      className={INP}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddDeviation}
                  className="h-10 w-fit gap-1.5 bg-[#111721] text-sm text-white hover:bg-slate-800 cursor-pointer"
                >
                  <CircleFadingPlus className="h-3.5 w-3.5" />
                  <Translate
                    text={localizationConstants.orderDagbokBtnMoreRows}
                  />
                </Button>
                {deviations.length > 0 && (
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full table-auto border-collapse">
                      <TableHeader>
                        <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
                          <TableHead className={TH}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDevSort("number")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColNumber)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDevSort("type")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColType)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={`${TH} text-center`}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDevSort("status")}
                              className="p-0 h-auto font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hover:bg-transparent"
                            >
                              <span>
                                {t(localizationConstants.orderDagbokColStatus)}
                              </span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </Button>
                          </TableHead>
                          <TableHead className={TH}>
                            <Translate
                              text={localizationConstants.orderDagbokColNote}
                            />
                          </TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {sortedDeviations.map((item) => (
                          <TableRow
                            key={item.id}
                            className="border-b border-slate-200 transition-colors hover:bg-slate-50/60"
                          >
                            <TableCell className={TD}>{item.number}</TableCell>
                            <TableCell className="px-4 py-3.5 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-white">
                                {getTypeLabel(item.type)}
                              </span>
                            </TableCell>
                            <TableCell className={`${TD} text-center`}>
                              {getStatusLabel(item.status)}
                            </TableCell>
                            <TableCell className={TD}>{item.note}</TableCell>
                            <TableCell className="px-4 py-3.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer rotate-90"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-slate-900" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
                                  <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900">
                                    <PencilLine className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionEdit,
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteDeviation(item.id)
                                    }
                                    className="text-xs gap-2 cursor-pointer text-slate-900 focus:text-slate-900"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-slate-900" />
                                    {t(
                                      localizationConstants.orderDagbokActionDelete,
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
