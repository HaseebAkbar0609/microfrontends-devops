import { AccessTabPage } from "@/features/access/components/access-tab/AccessTabPage";

/** "Access" tab (TFS-1103). The layout above already returns 404 for an unknown id. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <AccessTabPage key={id} recordId={id} />;
}
