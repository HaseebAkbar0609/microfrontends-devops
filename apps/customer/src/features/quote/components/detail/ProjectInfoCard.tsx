import { FileText } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { InfoSection, DetailCard } from "../shared";

interface ProjectInfoCardProps {
	projectName: string;
	isExpressJob: boolean | string;
	clientNo: string;
	category: string;
}

export function ProjectInfoCard({ projectName, isExpressJob, clientNo, category }: ProjectInfoCardProps) {
	return (
		<DetailCard
			icon={FileText}
			title={localizationConstants.projectInformationSection}
			className="p-0"
		>
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<InfoSection
					label={localizationConstants.projectNameLabel}
					value={projectName}
				/>
				<InfoSection
					label={localizationConstants.isExpressJobLabel}
					value={isExpressJob}
				/>
				<InfoSection
					label={localizationConstants.clientNoLabel}
					value={clientNo}
				/>
				<InfoSection
					label={localizationConstants.categoryLabel}
					value={category}
				/>
				<div className="col-span-2 border-t border-slate-100 pt-6">
					<InfoSection
						label={localizationConstants.projectAddressLabel}
						value="Stengatan 10"
					/>
				</div>
				<InfoSection
					label={localizationConstants.projectCityLabel}
					value="Solna"
				/>
				<InfoSection
					label={localizationConstants.projectPostalCodeLabel}
					value="171 63"
				/>
				<div className="col-span-2">
					<InfoSection
						label={localizationConstants.directionsLabel}
						value="3rd street from the Ikea store"
					/>
				</div>
			</div>
		</DetailCard>
	);
}
