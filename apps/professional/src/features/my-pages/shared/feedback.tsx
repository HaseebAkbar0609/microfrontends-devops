"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useMyPagesRefresh } from "./api";

export function myPagesError(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return status === 409 ? localizationConstants.myPagesConflict :
    status === 403 ? localizationConstants.myPagesForbidden :
    status === 404 ? localizationConstants.myPagesNotFound :
    status === 400 || status === 422 ? localizationConstants.myPagesInvalid : localizationConstants.myPagesRequestError;
}

export function useMyPagesAction() {
  const t = useTranslate();
  const refresh = useMyPagesRefresh();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const run = async (action: () => Promise<unknown>, successKey?: string) => {
    if (busy.current) return false;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      await action();
      await refresh();
      if (successKey) showToast("success", t(successKey));
      return true;
    } catch (cause) {
      setError(cause);
      showToast("error", t(myPagesError(cause)));
      return false;
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  return { run, pending, error };
}

export function MyPagesQueryState({ query }: { query: {
  isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown;
} }) {
  if (query.isPending) return <p role="status" className="p-4 text-sm text-slate-500"><Translate text={localizationConstants.myPagesLoading} /></p>;
  if (!query.isError) return null;
  return <div role="alert" className="flex items-center gap-3 p-4 text-sm text-red-700">
    <Translate text={myPagesError(query.error)} />
    <Button type="button" variant="outline" onClick={() => void query.refetch()}><Translate text={localizationConstants.myPagesRetry} /></Button>
  </div>;
}
