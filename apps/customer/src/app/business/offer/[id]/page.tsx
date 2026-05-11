import ProjectDetailPage from "@/features/quote/components/ProjectDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "View detailed information about your project.",
};

export default function Page() {
	return <ProjectDetailPage />;
}
