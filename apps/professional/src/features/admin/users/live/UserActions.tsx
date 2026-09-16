"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminWrite, type AdminUser } from "./api";
import { Confirm, State } from "./ui";

const ACTIONS: Record<string, string> = { activate: "proAdminActivate", deactivate: "proAdminDeactivate", resend: "proAdminResend", delete: "proAdminDelete" };
export default function UserActions({ user }: { user: AdminUser }) {
  const t = useTranslate();
  const write = useAdminWrite();
  const [action, setAction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function confirm() {
    if (busy) return;
    setBusy(true); setError(undefined);
    try {
      await write(action === "delete" ? "delete" : "post", `users/${user.id}${action === "delete" ? "" : "/" + (action === "resend" ? "resend-invitation" : action)}`);
      setAction(""); toast.success(t("proAdminSaved"));
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <div className="flex gap-1">
    <Button asChild variant="ghost" size="icon" title={t("proAdminEdit")}><Link aria-label={t("proAdminEdit") + " " + user.email} href={`/admin/user/settings?userId=${user.id}`}><Pencil className="h-4 w-4" /></Link></Button>
    {user.available_actions.some(a => ACTIONS[a]) && <DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label={t("proAdminActions")}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent>{user.available_actions.filter(a => ACTIONS[a]).map(a => <DropdownMenuItem key={a} onSelect={() => { setAction(a); setError(undefined); }}>{t(ACTIONS[a])}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    {action && <Confirm name={`${t(ACTIONS[action])}: ${user.display_name || user.email}`} busy={busy} onCancel={() => setAction("")} onConfirm={() => void confirm()}><State error={error} /></Confirm>}
  </div>;
}
