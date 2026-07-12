import CreateConsultantRequestForm from "@/features/consultant/components/create/CreateConsultantRequestForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "Submit a request to find a consultant for your project.",
};

export default function CreateConsultantPage() {
	return <CreateConsultantRequestForm />;
}
