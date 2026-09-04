import ConsultantListFeature from "@/features/consultant/components/Index";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "Browse and manage the consultants linked to your account.",
};

export default function ConsultantListPage() {
	return <ConsultantListFeature />;
}
