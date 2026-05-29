"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common";
import localizationConstants from "@/utils/translation/constants";
import { BREADCRUMBS, DUMMY_USERS } from "../constants";
import { UserProfileForm } from "./UserProfileForm";

type Props = {
	mode: "create" | "edit";
	userId?: string;
};

const CURRENT_USER_ID = "1";
const CURRENT_USER_IS_MAIN = true;

export default function UserProfilePage({ mode, userId }: Props) {
	const router = useRouter();

	const user = useMemo(() => {
		if (mode === "create") return null;
		return DUMMY_USERS.find((item) => item.id === userId) ?? null;
	}, [mode, userId]);

	const isOwnProfile = user?.id === CURRENT_USER_ID;
	const readOnly = !CURRENT_USER_IS_MAIN;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={mode === "create" ? localizationConstants.createNewButtonText : localizationConstants.users}
				breadcrumbs={[
					...BREADCRUMBS,
					{ label: mode === "create" ? localizationConstants.createNewButtonText : localizationConstants.edit },
				]}
			/>

			<div className="p-5">
				<UserProfileForm
					mode={mode}
					user={user}
					readOnly={readOnly}
					isOwnProfile={isOwnProfile}
					onCancel={() => router.push("/settings/users")}
					onSaved={() => router.push("/settings/users")}
				/>
			</div>
		</div>
	);
}