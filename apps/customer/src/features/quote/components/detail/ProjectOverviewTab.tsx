import { PersonalInfoCard } from "./PersonalInfoCard";
import { ProjectInfoCard } from "./ProjectInfoCard";
import { ProjectDescriptionCard } from "./ProjectDescriptionCard";
import { InviteSuppliersCard } from "./InviteSuppliersCard";

import type { CreateOfferFormValues } from "../../types/form";

interface ProjectOverviewTabProps {
	project: Partial<CreateOfferFormValues> & {
		refNo?: string;
		status?: string;
	};
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
	const categoryDisplay = Array.isArray(project.category)
		? project.category.join(", ")
		: typeof project.category === "string"
			? project.category
			: "";

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
			<PersonalInfoCard
				firstName={project.firstName}
				lastName={project.lastName}
				mobileNumber={project.mobileNumber}
				email={project.personalEmail}
				address={project.address}
				city={project.personalCityName || project.city}
				postalCode={project.pincode}
			/>
			<ProjectInfoCard
				projectName={project.projectName || ""}
				isExpressJob={project.isExpressJob === "express" || project.isExpressJob === "true"}
				clientNo={project.clientNo || project.refNo || ""}
				category={categoryDisplay}
				address={project.projectAddress}
				city={project.projectCityName || project.projectCity}
				postalCode={project.projectPostalCode}
				directions={project.directions}
			/>
			<ProjectDescriptionCard
				description={project.description}
				documents={project.documents}
			/>
			<InviteSuppliersCard
				suppliers={project.invitedSuppliers}
			/>
		</div>
	);
}
