"use client";
import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery, useAdminWrite, type AdminUser } from "./api";
import { State } from "./ui";
import { NO_LICENSE } from "./license.constants";

type Pool = { subscription_plan_id: string; plan_key: string; purchased: number; allocated: number; available: number };

function LicenseDialog({ user, close }: { user: AdminUser; close: () => void }) {
  const t = useTranslate();
  const query = useAdminQuery<Pool[]>("licenses/summary");
  const write = useAdminWrite();
  const [selected, setSelected] = useState(user.license_plan_id || NO_LICENSE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const pools = query.data?.data ?? [];
  async function save() {
    if (busy || query.isLoading || query.isError) return;
    setBusy(true); setError(undefined);
    try {
      await write("post", `users/${user.id}/licenses`, { subscription_plan_id: selected === NO_LICENSE ? null : selected });
      toast.success(t("proAdminSaved")); close();
    } catch (e) { setError(e); void query.refetch(); } finally { setBusy(false); }
  }
  return <Dialog open onOpenChange={open => !open && !busy && close()}><DialogContent className="max-w-md">
    <DialogTitle>{t("staffLicenseAssign")}</DialogTitle>
    <DialogDescription className="break-words">{user.display_name || user.email}</DialogDescription>
    <State loading={query.isLoading} error={query.error} retry={() => void query.refetch()} />
    <label className="grid gap-2 text-sm">{t("proAdminLicense")}
      <Select value={selected} onValueChange={setSelected} disabled={busy || query.isLoading || query.isError}>
        <SelectTrigger aria-label={t("proAdminLicense")}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_LICENSE}>{t("staffLicenseNone")}</SelectItem>
          {user.license_plan_id && !pools.some(p => p.subscription_plan_id === user.license_plan_id) &&
            <SelectItem value={user.license_plan_id} disabled>{user.license} ({t("staffLicenseUnavailable")})</SelectItem>}
          {pools.map(p => <SelectItem key={p.subscription_plan_id} value={p.subscription_plan_id}
            disabled={p.available === 0 && p.subscription_plan_id !== user.license_plan_id}>
            {p.plan_key.toUpperCase()} ({t("staffLicenseAvailable", { count: p.available })})
          </SelectItem>)}
        </SelectContent>
      </Select>
    </label>
    {!query.isLoading && !query.isError && !pools.some(p => p.available > 0) && <p className="text-sm text-muted-foreground">{t("staffLicenseNoSeats")}</p>}
    <p className="text-sm text-muted-foreground">{t("staffLicenseConfirmHint")}</p>
    <State error={error} />
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={busy} onClick={close}>{t("proAdminCancel")}</Button>
      <Button disabled={busy || query.isLoading || query.isError || selected === (user.license_plan_id || NO_LICENSE)} onClick={() => void save()}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("proAdminConfirm")}
      </Button>
    </div>
  </DialogContent></Dialog>;
}

export default function UserLicense({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const t = useTranslate();
  return <>
    <Button variant="ghost" size="icon" title={t("staffLicenseAssign")} aria-label={`${t("staffLicenseAssign")}: ${user.display_name || user.email}`} onClick={() => setOpen(true)}><KeyRound className="h-4 w-4" /></Button>
    {open && <LicenseDialog user={user} close={() => setOpen(false)} />}
  </>;
}
