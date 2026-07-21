import { FileText } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { InfoSection, DetailCard } from "../shared";

interface PersonalInfoCardProps {
	firstName?: string;
	lastName?: string;
	mobileNumber?: string;
	email?: string;
	address?: string;
	city?: string;
	postalCode?: string;
}

export function PersonalInfoCard({
	firstName,
	lastName,
	mobileNumber,
	email,
	address,
	city,
	postalCode,
}: PersonalInfoCardProps) {
	return (
		<DetailCard
			icon={FileText}
			title={localizationConstants.personalInformationSection}
			className="p-0"
		>
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<InfoSection
					label={localizationConstants.firstNameLabel}
					value={firstName || "-"}
				/>
				<InfoSection
					label={localizationConstants.lastNameLabel}
					value={lastName || "-"}
				/>
				<InfoSection
					label={localizationConstants.mobileNumberLabel}
					value={mobileNumber || "-"}
				/>
				<InfoSection
					label={localizationConstants.personalEmailLabel}
					value={email || "-"}
				/>
				<div className="col-span-2">
					<InfoSection
						label={localizationConstants.addressLabel}
						value={address || "-"}
					/>
				</div>
				<InfoSection
					label={localizationConstants.cityLabel}
					value={city || "-"}
				/>
				<InfoSection
					label={localizationConstants.postalcode}
					value={postalCode || "-"}
				/>
			</div>
		</DetailCard>
	);
}
