import { PersonalInfoCard } from "./PersonalInfoCard";
import { ProjectInfoCard } from "./ProjectInfoCard";
import { ProjectDescriptionCard } from "./ProjectDescriptionCard";
import { InviteSuppliersCard } from "./InviteSuppliersCard";

interface ProjectOverviewTabProps {
	project: {
		projectName: string;
		type: string;
		refNo: string;
		category: string;
	};
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
			<PersonalInfoCard />
			<ProjectInfoCard
				projectName={project.projectName}
				isExpressJob={project.type === "Express"}
				clientNo={project.refNo}
				category={project.category}
			/>
			<ProjectDescriptionCard />
			<InviteSuppliersCard />
		</div>
	);
}
