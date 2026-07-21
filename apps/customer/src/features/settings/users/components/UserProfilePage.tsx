"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/common";
import localizationConstants from "@/utils/translation/constants";
import { BREADCRUMBS } from "../constants";
import { UserProfileForm } from "./UserProfileForm";
import { UserFormSkeleton } from "./UserFormSkeleton";
import { getCustomerUserByIdAPIAction } from "@/api-actions/users";
import { mapApiUserToUser } from "../utils/userFormatters";
import type { User } from "../types/types";
import { showToast } from "@/lib/toast";

type Props = {
	mode: "create" | "edit";
	userId?: string;
};

const CURRENT_USER_ID = "1";
const CURRENT_USER_IS_MAIN = true;

export default function UserProfilePage({ mode, userId }: Props) {
	const router = useRouter();
	const { t } = useTranslation();

	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(mode === "edit");

	useEffect(() => {
		if (mode === "edit" && userId) {
			setIsLoading(true);
			getCustomerUserByIdAPIAction(userId)
				.then((res) => {
					if (res.success && res.data) {
						setUser(mapApiUserToUser(res.data));
					} else {
						showToast("error", res.error || "Failed to load user details");
						setUser(null);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [mode, userId]);

	const isOwnProfile = user?.id === CURRENT_USER_ID;
	const readOnly = !CURRENT_USER_IS_MAIN;
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
				{isLoading ? (
					<UserFormSkeleton />
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
