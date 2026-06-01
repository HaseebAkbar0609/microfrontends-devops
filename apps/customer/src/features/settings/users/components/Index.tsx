"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";

import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";

import localizationConstants from "@/utils/translation/constants";
import { BREADCRUMBS, DUMMY_USERS } from "../constants";
import type { User } from "../types/types";

export default function UsersFeature() {
  const { query } = useQueryParams();

  const sortBy = query.get("sort_by") || "";
  const sortOrder = query.get("sort_order") || "";
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listVersion, setListVersion] = useState(0);

  useEffect(() => {
    setLoadError(null);

    // API integration pending backend endpoint; list data is mocked intentionally.
    setUsers(DUMMY_USERS);
    setLoading(false);
  }, [sortBy, sortOrder, listVersion]);

  return (
    <div className="flex flex-1 flex-col bg-blue-gray-50">
      <PageHeader title={localizationConstants.users} breadcrumbs={BREADCRUMBS} />
      <UsersToolbar createHref="/settings/users/create" />
      <div className="p-5 flex-1">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-600" role="alert">
            {loadError}
          </p>
        ) : (
          <UsersTable data={users} onRefresh={() => setListVersion((v) => v + 1)} />
        )}
      </div>
    </div>
  );
}
