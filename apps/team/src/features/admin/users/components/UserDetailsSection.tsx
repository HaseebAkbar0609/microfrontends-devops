"use client";

import { useState, useRef, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  CircleUserRound,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Users,
  ShieldCheck,
  UserRound,
  Info,
  BadgePercent,
  Blocks,
  ShoppingBag,
  Table2,
  ShoppingCart,
  Truck,
  LayoutPanelLeft,
  Diff,
  ScrollText,
  StickyNote,
} from "lucide-react";

import Image from "next/image";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSwitch } from "@/components/form/FormSwitch";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";

const MOCK_USERS = [
  {
    value: "rachel",
    name: "Rachel Meyers",
    email: "@rachel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    value: "kalle",
    name: "Kalle Andersson",
    email: "@kalle",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    value: "sten",
    name: "Sten Svensson",
    email: "@sten",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    value: "sture",
    name: "Sture Larsson",
    email: "@sture",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
  },
];

const GROUP_OPTIONS = [
  { value: "ekonomi", label: "Ekonomi" },
  { value: "service", label: "Service" },
  { value: "overhead", label: "Overhead" },
  { value: "entreprenad", label: "Entreprenad" },
];

const ROLE_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "projektledare", label: "Projektledare" },
  { value: "ekonomi", label: "Ekonomi" },
];

const TYPE_OPTIONS = [
  { value: "arbetschef", label: "Arbetschef" },
  { value: "service", label: "Service" },
  { value: "admin", label: "Admin" },
];

interface ModuleItem {
  titleKey: string;
  field: keyof UserDetailsFormValues;
  icon: React.ComponentType<{ className?: string }>;
  checked: boolean;
}

interface PermissionColumn {
  titleKey: string;
  modules: ModuleItem[];
  allField: keyof UserDetailsFormValues;
}

const COLUMNS: PermissionColumn[] = [
  {
    titleKey: "userDetailsSales",
    modules: [
      { titleKey: "moduleSell", field: "permSalesSell", icon: BadgePercent, checked: false },
      { titleKey: "moduleMarknad", field: "permSalesMarknad", icon: Blocks, checked: true },
    ],
    allField: "permSalesAll",
  },
  {
    titleKey: "userDetailsEconomy",
    modules: [
      { titleKey: "moduleEkonomi", field: "permEconEkonomi", icon: ShoppingBag, checked: false },
      { titleKey: "moduleFaktura", field: "permEconFaktura", icon: Table2, checked: true },
      { titleKey: "modulePersonal", field: "permEconPersonal", icon: ShoppingCart, checked: false },
      { titleKey: "moduleJuridik", field: "permEconJuridik", icon: ShieldCheck, checked: true },
      { titleKey: "modulePrognoser", field: "permEconPrognoser", icon: Truck, checked: true },
    ],
    allField: "permEconAll",
  },
  {
    titleKey: "userDetailsBusinessSupport",
    modules: [
      { titleKey: "moduleAvtal", field: "permBizAvtal", icon: CircleDollarSign, checked: true },
      { titleKey: "moduleDataIT", field: "permBizDataIT", icon: LayoutPanelLeft, checked: false },
      { titleKey: "moduleKMA", field: "permBizKMA", icon: Diff, checked: true },
      { titleKey: "moduleMailet", field: "permBizMailet", icon: ScrollText, checked: true },
      { titleKey: "moduleLedningsstod", field: "permBizLedningsstod", icon: StickyNote, checked: false },
    ],
    allField: "permBizAll",
  },
];

function ModuleIcon({ mod }: { mod: ModuleItem }) {
  return <mod.icon className="h-4 w-4 text-slate-600 shrink-0" />;;
}

function PermissionPanel({ col, form }: { col: PermissionColumn; form: UseFormReturn<UserDetailsFormValues> }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-slate-100 px-4 py-2.5 text-left border-b border-slate-200"
      >
        <h4 className="text-sm font-bold text-slate-700"><Translate text={col.titleKey} /></h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_110px_100px] items-center border-b border-slate-200 bg-slate-50/30 py-2.5">
            <span className="text-sm font-medium leading-6 text-slate-500 pl-4 font-sans">
              <Translate text={localizationConstants.userDetailsModules} />
            </span>
            <span className="text-center text-sm font-medium leading-6 text-slate-500 font-sans">
              <Translate text={localizationConstants.userDetailsAccess} />
            </span>
            <span />
          </div>

          {col.modules.map((mod) => (
            <div
              key={mod.field}
              className="grid grid-cols-[1fr_110px_100px] items-center border-b border-slate-200 py-3.5 last:border-b-0 hover:bg-slate-50/10"
            >
              <div className="flex items-center gap-2 pl-4">
                <ModuleIcon mod={mod} />
                <span className="text-sm font-medium leading-6 text-slate-700 font-sans"><Translate text={mod.titleKey} /></span>
              </div>
              <div className="flex items-center justify-center">
                <FormCheckbox
                  control={form.control}
                  name={mod.field}
                  className="m-0"
                  checkboxClassName="h-4 w-4"
                  variant="secondary"
                />
              </div>
              <div className="flex justify-end pr-4">
                <button
                  type="button"
                  className="inline-flex h-7 items-center justify-center rounded border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Translate text={localizationConstants.userDetailsOpen} />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-[1fr_110px_100px] items-center border-t border-slate-200 bg-white h-12">
            <div className="flex h-full items-center gap-1.5 bg-[#96f27b] pl-4 text-xs font-semibold text-slate-800">
              <Blocks className="h-4 w-4 text-slate-800" />
              <span>
                <Translate text={localizationConstants.userDetailsAll} />
              </span>
            </div>
            <div className="flex items-center justify-center">
              <FormCheckbox
                control={form.control}
                name={col.allField}
                className="m-0"
                checkboxClassName="h-4 w-4"
                variant="secondary"
              />
            </div>
            <div className="flex justify-end pr-4">
              <button
                type="button"
                className="inline-flex h-7 items-center justify-center rounded border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Translate text={localizationConstants.userDetailsOpen} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface UserDetailsSectionProps {
  form: UseFormReturn<UserDetailsFormValues>;
  showDetails: boolean;
  onToggleDetails: () => void;
}

export function UserDetailsSection({ form, showDetails, onToggleDetails }: UserDetailsSectionProps) {
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Section 1: Välj användare */}
      <div className="relative mb-4 overflow-visible rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
          <UserRound className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
          <span className="text-sm font-semibold text-slate-700">
            <Translate text={localizationConstants.userDetailsSelectUser} />
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-left text-sm hover:bg-slate-50 focus:outline-none"
            >
              <Image
                src={selectedUser.avatar}
                className="h-6 w-6 rounded-full object-cover shrink-0"
                width={24}
                height={24}
                alt=""
              />
              <span className="font-medium text-slate-900">{selectedUser.name}</span>
              <span className="text-slate-400">{selectedUser.email}</span>
              <span className="ml-auto">
                {dropdownOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.value}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 ${
                      selectedUser.value === user.value ? "bg-slate-50" : ""
                    }`}
                  >
                    <Image
                      src={user.avatar}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleDetails}
            className="ml-0 sm:ml-4 inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 cursor-pointer w-full sm:w-auto"
          >
            <Translate text={localizationConstants.userDetailsShowDetails} />
          </button>
        </div>
      </div>

      {/* Section 2: Användarinformation + Program/Behörighet */}
      {showDetails && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-4 cursor-pointer hover:bg-slate-50/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
              <span className="text-sm font-semibold text-slate-700">
                <Translate text={localizationConstants.userDetailsUserInformation} />
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {isExpanded && (
            <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-slate-700">
                    <Translate text={localizationConstants.userDetailsUserLabel} />
                  </label>
                  <p className="text-sm text-slate-500">{selectedUser.name}</p>
                </div>
                <FormSwitch
                  control={form.control}
                  name="isAdmin"
                  label="Admin"
                  yesLabel={<Translate text={localizationConstants.yesLabel} />}
                  noLabel={<Translate text={localizationConstants.noLabel} />}
                />
                <div />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  control={form.control}
                  name="group"
                  label="Grupp"
                  options={GROUP_OPTIONS}
                  leadingIcon={Users}
                  triggerClassName="w-full !w-full justify-between text-left border-slate-200"
                />
                <FormSelect
                  control={form.control}
                  name="role"
                  label="Roll"
                  options={ROLE_OPTIONS}
                  leadingIcon={CircleUserRound}
                  triggerClassName="w-full !w-full justify-between text-left border-slate-200"
                />
                <FormSelect
                  control={form.control}
                  name="type"
                  label="Typ"
                  options={TYPE_OPTIONS}
                  triggerClassName="w-full !w-full justify-between text-left border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormCheckbox
                  control={form.control}
                  name="reports"
                  label={<Translate text={localizationConstants.userDetailsReports} />}
                  variant="secondary"
                />
                <FormCheckbox
                  control={form.control}
                  name="registerImportant"
                  label={<Translate text={localizationConstants.userDetailsRegisterImportant} />}
                  variant="secondary"
                />
                <div />
              </div>

              <hr className="border-t border-slate-200 my-2" />

              {/* Program/Behörighet */}
              <div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-slate-700">
                    <Translate text={localizationConstants.userDetailsPermissions} />
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {COLUMNS.map((col) => (
                    <PermissionPanel key={col.titleKey} col={col} form={form} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
