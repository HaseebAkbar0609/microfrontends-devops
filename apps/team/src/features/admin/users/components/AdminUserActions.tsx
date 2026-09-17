"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, MoreVertical, UserCheck, UserX, Mail, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { allowedUserActions } from "../utils/adminUserTable";
import type { AdminUser, AdminUserAction } from "../types/adminUsers.types";

export function AdminUserActions({ user, pending, onAction }: { user: AdminUser; pending: boolean; onAction: (user: AdminUser, action: AdminUserAction) => void }) {
  const { t } = useTranslation();
  const actions = allowedUserActions(user);
  const commands = [
    { action: "activate" as const, Icon: UserCheck, label: localizationConstants.adminActionActivate },
    { action: "deactivate" as const, Icon: UserX, label: localizationConstants.adminActionDeactivate },
    { action: "resend" as const, Icon: Mail, label: localizationConstants.adminActionResend },
    { action: "delete" as const, Icon: Trash2, label: localizationConstants.actionDelete },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={pending} className="h-8 w-8 text-slate-500" aria-label={t(localizationConstants.adminActionsMenu)}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem asChild><Link href={`/admin/users/user-settings?id=${encodeURIComponent(user.id)}`}><Eye className="h-4 w-4" />{t(localizationConstants.actionView)}</Link></DropdownMenuItem>
        {actions.includes("edit") && <DropdownMenuItem asChild><Link href={`/admin/users/add-user?id=${encodeURIComponent(user.id)}`}><Pencil className="h-4 w-4" />{t(localizationConstants.actionEdit)}</Link></DropdownMenuItem>}
        {commands.filter((command) => actions.includes(command.action)).map(({ action, Icon, label }) => <DropdownMenuItem key={action} variant={action === "delete" ? "destructive" : "default"} onSelect={() => onAction(user, action)}><Icon className="h-4 w-4" />{t(label)}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
