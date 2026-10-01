import { notFound } from "next/navigation";
import { AccessDetailsPage } from "@/features/access/components/details/AccessDetailsPage";
import { ACCESS_DETAILS_MOCK } from "@/features/access/data/accessDetails.mock";
import { ACCESS_POINTS_MOCK } from "@/features/access/data/accessPoints.mock";
import { findAccessDetails } from "@/features/access/utils/accessDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const details = findAccessDetails(id, ACCESS_POINTS_MOCK, ACCESS_DETAILS_MOCK);
	if (!details) notFound();

	// Keyed by record, so sorting on one record is not carried over to the next.
	return <AccessDetailsPage key={details.id} details={details} />;
}
