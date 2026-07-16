import { FileText } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { InfoSection, DetailCard } from "../shared";

interface ProjectInfoCardProps {
	projectName: string;
	isExpressJob: boolean | string;
	clientNo: string;
	category: string;
	address?: string;
	city?: string;
	postalCode?: string;
	directions?: string;
}

export function ProjectInfoCard({
	projectName,
	isExpressJob,
	clientNo,
	category,
	address,
	city,
	postalCode,
	directions,
}: ProjectInfoCardProps) {
	const expressValue =
		typeof isExpressJob === "boolean"
			? isExpressJob
				? "Yes"
				: "No"
			: isExpressJob || "-";

	return (
		<DetailCard
			icon={FileText}
			title={localizationConstants.projectInformationSection}
			className="p-0"
		>
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<InfoSection
					label={localizationConstants.projectNameLabel}
					value={projectName || "-"}
				/>
				<InfoSection
					label={localizationConstants.isExpressJobLabel}
					value={expressValue}
				/>
				<InfoSection
					label={localizationConstants.clientNoLabel}
					value={clientNo || "-"}
				/>
				<InfoSection
					label={localizationConstants.categoryLabel}
					value={category || "-"}
				/>
				<div className="col-span-2 border-t border-slate-100 pt-6">
					<InfoSection
						label={localizationConstants.projectAddressLabel}
						value={address || "-"}
					/>
				</div>
				<InfoSection
					label={localizationConstants.projectCityLabel}
					value={city || "-"}
				/>
				<InfoSection
					label={localizationConstants.projectPostalCodeLabel}
					value={postalCode || "-"}
				/>
				<div className="col-span-2">
					<InfoSection
						label={localizationConstants.directionsLabel}
						value={directions || "-"}
					/>
				</div>
			</div>
		</DetailCard>
	);
}
