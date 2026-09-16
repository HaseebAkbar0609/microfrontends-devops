"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { CatalogTable } from "./CatalogTable";
import { previewCatalog, syncCatalog, type CatalogPreview } from "./stripeCatalog.api";
import { useCatalogAccess } from "./useCatalogAccess";

export function StripeCatalogPage() {
  const { scope } = useCatalogAccess();
  return <CatalogSession key={scope} />;
}

function CatalogSession() {
  const { t } = useTranslation();
  const { access } = useCatalogAccess();
  const [preview, setPreview] = useState<CatalogPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<number | null>(null);
  function fail(err: unknown) {
    setPreview(null);
    setError(isAxiosError(err) && err.response?.status === 409 ? localizationConstants.stripeCatalogStale : localizationConstants.stripeCatalogError);
  }
  async function loadPreview() {
    if (busy) return;
    setBusy(true); setError(null); setUpdated(null); setPreview(null);
    try { setPreview(await previewCatalog()); } catch (err) { fail(err); } finally { setBusy(false); }
  }
  async function apply() {
    if (busy || !preview || preview.blocked || !preview.changes) return;
    setBusy(true); setError(null);
    try {
      const result = await syncCatalog(preview.fingerprint);
      setUpdated(result.updated_prices); setPreview(null); setConfirm(false);
    } catch (err) { fail(err); setConfirm(false); } finally { setBusy(false); }
  }
  return <div className="min-w-0">
    <PageHeader title={t(localizationConstants.stripeCatalogTitle)} breadcrumbs={[{ label: t(localizationConstants.adminUsers), href: "/admin/users" }, { label: t(localizationConstants.stripeCatalogTitle) }]} />
    <div className="flex min-w-0 flex-col gap-5 p-4 sm:p-8" aria-busy={busy || access.isPending}>
      {access.isPending && <p role="status">{t(localizationConstants.stripeCatalogLoading)}</p>}
      {access.isError && <div role="alert"><p>{t(localizationConstants.stripeCatalogError)}</p><Button variant="outline" onClick={() => void access.refetch()}>{t(localizationConstants.adminRetry)}</Button></div>}
      {access.isSuccess && !access.data.can_sync && <p role="alert">{t(localizationConstants.stripeCatalogDenied)}</p>}
      {access.data?.can_sync && <>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" disabled={busy} onClick={() => void loadPreview()}><RefreshCw className="size-4" />{t(localizationConstants.stripeCatalogPreview)}</Button>
          {preview && <Button disabled={busy || preview.blocked || !preview.changes} onClick={() => setConfirm(true)}>{t(localizationConstants.stripeCatalogSync)}</Button>}
        </div>
        {busy && <p role="status">{t(localizationConstants.stripeCatalogLoading)}</p>}
        {error && <p role="alert" className="text-destructive">{t(error)}</p>}
        {updated !== null && <p role="status">{t(localizationConstants.stripeCatalogSuccess, { count: updated })}</p>}
        {preview && <>
          <p className="break-all">{preview.account_id} · {t(preview.livemode ? localizationConstants.stripeCatalogLive : localizationConstants.stripeCatalogTest)}</p>
          {preview.blocked && <p role="alert" className="text-destructive">{t(localizationConstants.stripeCatalogBlocked)}</p>}
          {!preview.blocked && !preview.changes && <p role="status">{t(localizationConstants.stripeCatalogUnchanged)}</p>}
          <CatalogTable preview={preview} />
        </>}
      </>}
    </div>
    <Dialog open={confirm} onOpenChange={open => { if (!busy) setConfirm(open); }}>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader><DialogTitle>{t(localizationConstants.stripeCatalogSync)}</DialogTitle><DialogDescription>{t(localizationConstants.stripeCatalogConfirm, { count: preview?.changes ?? 0, account: preview?.account_id ?? "" })}</DialogDescription></DialogHeader>
        <DialogFooter><Button variant="outline" disabled={busy} onClick={() => setConfirm(false)}>{t(localizationConstants.cancelLabel)}</Button><Button disabled={busy} onClick={() => void apply()}>{t(localizationConstants.stripeCatalogSync)}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
