"use client";

import { useEffect, useState } from "react";

import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";

import { DUMMY_USERS } from "../constants";
import type { User } from "../types/types";

export default function UsersFeature() {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [listVersion, setListVersion] = useState(0);

  useEffect(() => {
    // API integration pending backend endpoint; list data is mocked intentionally.
    setUsers(DUMMY_USERS);
  }, [listVersion]);

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
