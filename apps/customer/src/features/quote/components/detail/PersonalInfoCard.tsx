import { FileText } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { InfoSection, DetailCard } from "../shared";

export function PersonalInfoCard() {
	return (
		<DetailCard
			icon={FileText}
			title={localizationConstants.personalInformationSection}
			className="p-0"
		>
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<InfoSection
					label={localizationConstants.firstNameLabel}
					value="Anna"
				/>
				<InfoSection
					label={localizationConstants.lastNameLabel}
					value="Andersson"
				/>
				<InfoSection
					label={localizationConstants.mobileNumberLabel}
					value="070-560 50 50"
				/>
				<InfoSection
					label={localizationConstants.personalEmailLabel}
					value="anna@gmail.com"
				/>
				<div className="col-span-2">
					<InfoSection
						label={localizationConstants.addressLabel}
						value="Stengatan 10"
					/>
				</div>
				<InfoSection
					label={localizationConstants.cityLabel}
					value="Solna"
				/>
				<InfoSection
					label={localizationConstants.postalcode}
					value="171 63"
				/>
			</div>
		</DetailCard>
	);
}
