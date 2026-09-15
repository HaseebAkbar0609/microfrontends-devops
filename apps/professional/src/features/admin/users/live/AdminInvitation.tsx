"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import { BASE_API_VERSION } from "@/constants/api";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_BYTES } from "./admin.constants";
import { Field, State } from "./ui";
import { fieldErrors } from "./api";

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") });
const ROOT = `${BASE_API_VERSION}/professionals/auth/`;
type Info = { company_name: string; requires_password: boolean };
export default function AdminInvitation() {
  const t = useTranslate();
  const token = useSearchParams().get("token") ?? "";
  const { clearSession } = useAuthStatus();
  const [accepted, setAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [invalid, setInvalid] = useState("");
  const query = useQuery({ queryKey: ["professional-invitation", token], enabled: !!token && !accepted, retry: false, gcTime: 0,
    staleTime: Infinity, refetchOnWindowFocus: false,
    queryFn: async () => (await client.post<{ data: Info }>(ROOT + "validate-invitation", { token })).data.data });
  async function accept() {
    if (!query.data || busy || accepted) return;
    setInvalid(""); setError(undefined);
    if (query.data.requires_password && (password.length < PASSWORD_MIN_LENGTH || new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES || password !== confirm)) { setInvalid(t("proAdminBadPassword")); return; }
    setBusy(true);
    try {
      await client.post(ROOT + "accept-invitation", query.data.requires_password ? { token, password, confirm_password: confirm } : { token });
      setAccepted(true); setPassword(""); setConfirm(""); window.history.replaceState(null, "", window.location.pathname);
    } catch (e) { setError(e); const fields = fieldErrors(e); setInvalid(fields.password || fields.confirm_password || ""); } finally { setBusy(false); }
  }
  return <main className="mx-auto w-full max-w-lg space-y-5 px-6 py-12"><h1 className="text-2xl font-semibold">{t("proAdminInvitation")}</h1>
    {accepted ? <><p role="status">{t("proAdminAccepted")}</p><Button asChild><Link href="/login" onClick={clearSession}>{t("proAdminLogin")}</Link></Button></> : !token || query.isError ? <p role="alert">{t("proAdminInvalidInvitation")}</p> : <>
      <State loading={query.isPending} error={error} />
      {query.data && <form className="space-y-4" onSubmit={e => { e.preventDefault(); void accept(); }}><p className="break-words">{query.data.company_name}</p><fieldset disabled={busy} className="min-w-0 space-y-4">
        {query.data.requires_password && <><Field label={t("proAdminPassword")} type="password" value={password} autoComplete="new-password" onChange={e => setPassword(e.target.value)} required minLength={PASSWORD_MIN_LENGTH} /><Field label={t("proAdminConfirmPassword")} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} error={invalid} required minLength={PASSWORD_MIN_LENGTH} /></>}
        <Button type="submit" disabled={busy}>{t(busy ? "proAdminSaving" : "proAdminAccept")}</Button>
      </fieldset></form>}
    </>}
  </main>;
}
