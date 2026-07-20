"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getCustomerUsersAPIAction } from "@/api-actions/users";
import { mapApiUserToUser } from "../utils/userFormatters";
import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";
import { DUMMY_USERS } from "../constants";
import type { User } from "../types/types";

export default function UsersFeature() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [listVersion, setListVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCustomerUsersAPIAction().then((res) => {
      if (!active) return;
      if (res.success && res.data && res.data.length > 0) {
        setUsers(res.data.map((u) => mapApiUserToUser(u)));
      } else {
        setUsers(DUMMY_USERS);
      }
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setUsers(DUMMY_USERS);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [listVersion]);

  return (
    <div className="px-5 py-5 flex-1">
      <UsersToolbar
        createHref="/settings/users/create"
        className="px-0 pt-0 pb-4"
      />
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
        </div>
      ) : (
        <UsersTable data={users} onRefresh={() => setListVersion((v) => v + 1)} />
      )}
    </div>
  );
}
