"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  CircleUserRound,
  ChevronDown,
  ChevronUp,
  Users,
  UserRound,
  Info,
  Blocks,
} from "lucide-react";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSwitch } from "@/components/form/FormSwitch";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import { useAdminUsers, useAdminGroups, useAdminRoleOptions, useAdminTypeOptions, useAdminModules } from "../hooks/useAdminUsers";

import * as Icons from "lucide-react";

export interface ModuleItem {
  id: string;
  name: string;
  name_sv?: string;
  icon?: string;
  order_key?: number;
}

export interface PermissionColumn {
  category: string;
  modules: ModuleItem[];
}

function DynamicIcon({ name, className }: { name?: string, className?: string }) {
  if (!name) return <Info className={className} />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as Record<string, any>)[name] || Info;
  return <IconComponent className={className} />;
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
        <h4 className="text-sm font-bold text-slate-700">
          <Translate text={(localizationConstants as Record<string, string>)[col.category] || col.category} />
        </h4>
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
              key={mod.id}
              className="grid grid-cols-[1fr_110px_100px] items-center border-b border-slate-200 py-3.5 last:border-b-0 hover:bg-slate-50/10"
            >
              <div className="flex items-center gap-2 pl-4">
                <DynamicIcon name={mod.icon} className="h-4 w-4 text-slate-600 shrink-0" />
                <span className="text-sm font-medium leading-6 text-slate-700 font-sans">{mod.name_sv || mod.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <FormCheckbox
                  control={form.control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`permissions.${mod.id}` as any}
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={`permissions.all_${col.category}` as any}
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
  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const { data: usersData } = useAdminUsers({ skip: 0, limit: 100 });
  const { data: groupsData } = useAdminGroups({ skip: 0, limit: 100 });
  const { data: rolesData } = useAdminRoleOptions();
  const { data: typesData } = useAdminTypeOptions();
  const { data: modulesData } = useAdminModules();
  const dynamicColumns = modulesData?.data || [];

  const groupOptions = (groupsData?.data || []).map((g: { id: string; name: string }) => ({ value: g.id, label: g.name }));
  const roleOptions = (rolesData?.data || []).map((r: { id: string; name: string }) => ({ value: r.id, label: r.name }));
  const typeOptions = (typesData?.data || []).map((t: { id: string; name: string }) => ({ value: t.id, label: t.name }));
  const id = searchParams.get("id");

  const activeUsers = useMemo(() => usersData?.data || [], [usersData]);
  const foundUser = activeUsers.find((u: { id: string; display_name?: string; first_name?: string; last_name?: string; email: string; phone_number?: string; last_login?: string; created_at?: string; avatar_url?: string; profile_picture_url?: string }) => u.id === id) || activeUsers[0];

  const initialUser = foundUser ? {
    value: foundUser.id,
    name: foundUser.display_name || `${foundUser.first_name || ""} ${foundUser.last_name || ""}`.trim() || "User",
    email: foundUser.email,
    phone: foundUser.phone_number || "",
    lastLogin: foundUser.last_login ? new Date(foundUser.last_login).toLocaleString() : "-",
    createdDate: foundUser.created_at ? new Date(foundUser.created_at).toLocaleDateString() : "-",
    avatar: foundUser.avatar_url || foundUser.profile_picture_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
  } : {
    value: "",
    name: "Select User...",
    email: "",
    phone: "",
    lastLogin: "",
    createdDate: "",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
  };

  const [selectedUser, setSelectedUser] = useState(initialUser);

  useEffect(() => {
    if (activeUsers.length > 0) {
      // If we have an id in the URL, try to match it. Otherwise fallback to the first active user.
      const targetId = id || activeUsers[0]?.id;

      if (targetId && selectedUser.value !== targetId) {
        const u = activeUsers.find((user: { id: string; display_name?: string; first_name?: string; last_name?: string; email: string; phone_number?: string; last_login?: string; created_at?: string; avatar_url?: string; profile_picture_url?: string }) => user.id === targetId) || activeUsers[0];
        if (u) {
          setSelectedUser({
            value: u.id,
            name: u.display_name || `${u.first_name || ""} ${u.last_name || ""}`.trim() || "User",
            email: u.email,
            phone: u.phone_number || "",
            lastLogin: u.last_login ? new Date(u.last_login).toLocaleString() : "-",
            createdDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : "-",
            avatar: u.avatar_url || u.profile_picture_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
          });
        }
      }
    }
  }, [activeUsers, id, selectedUser.value]);

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
              <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg max-h-64 overflow-y-auto">
                {activeUsers.length > 0 ? activeUsers.map((user: { id: string; display_name?: string; first_name?: string; last_name?: string; email: string; phone_number?: string; last_login?: string; created_at?: string; avatar_url?: string; profile_picture_url?: string }) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser({
                        value: user.id,
                        name: user.display_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User",
                        email: user.email,
                        phone: user.phone_number || "",
                        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : "-",
                        createdDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : "-",
                        avatar: user.avatar_url || user.profile_picture_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                      });
                      setDropdownOpen(false);
                      router.push(`${pathname}?id=${user.id}`);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 ${selectedUser.value === user.id ? "bg-slate-50" : ""
                      }`}
                  >
                    <Image
                      src={user.avatar_url || user.profile_picture_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{user.display_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </button>
                )) : null}
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
              {/* User Overview Fields from BE Response */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <Image
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      <Translate text={localizationConstants.nameLabel} />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      <Translate text={localizationConstants.addUserEmailLabel} />
                    </span>
                    <span className="text-sm text-slate-700">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      <Translate text={localizationConstants.userDetailsPhone} />
                    </span>
                    <span className="text-sm text-slate-700">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      <Translate text={localizationConstants.userDetailsLastLogin} />
                    </span>
                    <span className="text-sm text-slate-700">{selectedUser.lastLogin}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      <Translate text={localizationConstants.userDetailsCreatedDate} />
                    </span>
                    <span className="text-sm text-slate-700">{selectedUser.createdDate}</span>
                  </div>
                </div>
                <div className="shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                  <FormSwitch
                    control={form.control}
                    name="isAdmin"
                    label={localizationConstants.userDetailsAdmin}
                    yesLabel={<Translate text={localizationConstants.yesLabel} />}
                    noLabel={<Translate text={localizationConstants.noLabel} />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  control={form.control}
                  name="group"
                  label={localizationConstants.userDetailsGroup}
                  options={groupOptions}
                  leadingIcon={Users}
                  triggerClassName="w-full !w-full justify-between text-left border-slate-200"
                />
                <FormSelect
                  control={form.control}
                  name="role"
                  label={localizationConstants.userDetailsRole}
                  options={roleOptions}
                  leadingIcon={CircleUserRound}
                  triggerClassName="w-full !w-full justify-between text-left border-slate-200"
                />
                <FormSelect
                  control={form.control}
                  name="type"
                  label={localizationConstants.userDetailsType}
                  options={typeOptions}
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
                  {dynamicColumns.map((col: PermissionColumn) => (
                    <PermissionPanel key={col.category} col={col} form={form} />
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
