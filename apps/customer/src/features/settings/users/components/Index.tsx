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
  <div className="px-5 py-5 flex-1">
  <UsersToolbar
    createHref="/settings/users/create"
    className="px-0 pt-0 pb-4"
  />
  <UsersTable data={users} onRefresh={() => setListVersion((v) => v + 1)} />
</div>

  );
}
