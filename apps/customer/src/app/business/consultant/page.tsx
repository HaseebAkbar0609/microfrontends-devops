import ConsultantDirectory from "@/features/consultant/components/ConsultantDirectory";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "Browse consultant types and manage your consulting requests.",
};

export default function ConsultantDirectoryPage() {
	return <ConsultantDirectory />;
}
