import { AccessItemDetailsPage } from "@/features/access/components/item-details/AccessItemDetailsPage";

/** Item details page (TFS-1104). The layout above already returns 404 for an unknown record. */
export default async function Page({ params }: { params: Promise<{ id: string; itemId: string }> }) {
	const { id, itemId } = await params;
	return <AccessItemDetailsPage key={`${id}/${itemId}`} recordId={id} itemId={itemId} />;
}
