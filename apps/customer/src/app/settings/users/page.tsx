import UsersFeature from "@/features/settings/users/components/Index";
import { Metadata } from "next";
//export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "View and manage all your quotations and offers in one place.",
};

export default function UsersPage() {
	return <UsersFeature />;
}
