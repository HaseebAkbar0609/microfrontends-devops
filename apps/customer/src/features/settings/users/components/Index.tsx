"use client";

import { useCallback, useEffect, useState } from "react";

import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";
import { getCustomerUsersAPIAction } from "@/api-actions/users";
import { mapApiUserToUser } from "../utils/userFormatters";
import type { User } from "../types/types";
import { showToast } from "@/lib/toast";

export default function UsersFeature() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		const result = await getCustomerUsersAPIAction();
		setIsLoading(false);
		if (result.success && result.data) {
			setUsers(result.data.map(mapApiUserToUser));
		} else if (!result.success) {
			showToast("error", result.error || "Failed to load users");
			setUsers([]);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return (
		<div className="flex flex-1 flex-col px-5 py-5">
			<UsersToolbar
				createHref="/settings/users/create"
				className="px-0 pb-4 pt-0"
			/>
			<UsersTable data={users} isLoading={isLoading} onRefresh={fetchUsers} />
		</div>
	);
}
