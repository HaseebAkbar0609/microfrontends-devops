"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common";
import { getCustomerUserByIdAPIAction } from "@/api-actions/users";
import { getCustomerProfileAPIAction } from "@/api-actions/profile/get";
import localizationConstants from "@/utils/translation/constants";
import { BREADCRUMBS, DUMMY_USERS } from "../constants";
import { mapApiUserToUser } from "../utils/userFormatters";
import type { User } from "../types/types";
import { UserProfileForm } from "./UserProfileForm";

type Props = {
	mode: "create" | "edit";
	userId?: string;
};

export default function UserProfilePage({ mode, userId }: Props) {
	const router = useRouter();
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(mode === "edit");

	useEffect(() => {
		if (mode === "create") {
			setUser(null);
			setLoading(false);
			return;
		}

		let active = true;
		setLoading(true);

		const fetchUser = async () => {
			if (userId) {
				const res = await getCustomerUserByIdAPIAction(userId);
				if (active && res.success && res.data) {
					setUser(mapApiUserToUser(res.data, userId));
					setLoading(false);
					return;
				}
			}
			const profileRes = await getCustomerProfileAPIAction();
			if (active && profileRes.success && profileRes.data) {
				setUser(mapApiUserToUser(profileRes.data, userId || profileRes.data.id));
				setLoading(false);
				return;
			}
			if (active) {
				setUser(DUMMY_USERS.find((item) => item.id === userId) ?? DUMMY_USERS[0]);
				setLoading(false);
			}
		};

		fetchUser().catch(() => {
			if (active) {
				setUser(DUMMY_USERS.find((item) => item.id === userId) ?? DUMMY_USERS[0]);
				setLoading(false);
			}
		});

		return () => {
			active = false;
		};
	}, [mode, userId]);

	const isOwnProfile = user?.account_type === "admin" || user?.id === userId;
	const readOnly = false;
	const pageTitle =
		mode === "create"
			? localizationConstants.createUser
			: localizationConstants.editUser;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={t(pageTitle)}
				className="gap-1 py-2"
				breadcrumbs={[
					...BREADCRUMBS.map((item) => ({
						...item,
						label: t(item.label),
					})),
					{ label: t(pageTitle) },
				]}
			/>

			<div className="px-5 py-2">
				{mode === "create" && (
					<p className="mb-2 text-sm text-slate-500">
						{t(localizationConstants.userFormDetailsHelp)}
					</p>
				)}
				{loading ? (
					<div className="flex min-h-[240px] items-center justify-center text-slate-500">
						<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
					</div>
				) : (
					<UserProfileForm
						mode={mode}
						user={user}
						readOnly={readOnly}
						isOwnProfile={isOwnProfile}
						onCancel={() => router.push("/settings/users")}
						onSaved={() => router.push("/settings/users")}
					/>
				)}
			</div>
		</div>
	);
}
