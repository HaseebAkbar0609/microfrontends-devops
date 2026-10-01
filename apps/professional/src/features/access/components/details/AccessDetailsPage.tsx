"use client";

import { CircleUserRound, UserPlus } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import type { AccessDetails } from "../../types/accessDetails.types";
import { AccessContactsTable } from "./AccessContactsTable";
import { AccessFieldGrid } from "./AccessFieldGrid";
import { AccessSectionCard } from "./AccessSectionCard";

/**
 * "Access Information" tab of the details page (TFS-1102): Object, Access
 * Information and Contact Person. Editing is not designed yet, so each Edit
 * button shows the coming-soon toast.
 */
export function AccessDetailsPage({ details }: { details: AccessDetails }) {
	const showComingSoon = useComingSoonToast();

	return (
		<div className="flex flex-col gap-4 px-5 py-5">
			<AccessSectionCard
				icon={<UserPlus className="h-5 w-5" aria-hidden />}
				title={localizationConstants.accessSectionObject}
				onEdit={showComingSoon}
			>
				<AccessFieldGrid
					fields={[{ label: localizationConstants.accessFieldProjectOrder, value: details.projectOrder }]}
				/>
			</AccessSectionCard>

			<AccessSectionCard
				icon={<UserPlus className="h-5 w-5" aria-hidden />}
				title={localizationConstants.accessSectionInformation}
				onEdit={showComingSoon}
			>
				<AccessFieldGrid
					fields={[
						{ label: localizationConstants.accessFieldAccessName, value: details.accessName },
						{ label: localizationConstants.address, value: details.address },
						{ label: localizationConstants.postalCode, value: details.postalCode },
						{ label: localizationConstants.city, value: details.city },
					]}
				/>
			</AccessSectionCard>

			<AccessSectionCard
				icon={<CircleUserRound className="h-5 w-5" aria-hidden />}
				title={localizationConstants.accessSectionContact}
				onEdit={showComingSoon}
			>
				<AccessContactsTable contacts={details.contacts} />
			</AccessSectionCard>
		</div>
	);
}
