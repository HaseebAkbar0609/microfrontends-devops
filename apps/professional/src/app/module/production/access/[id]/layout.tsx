import { notFound } from "next/navigation";
import { AccessRecordHeader } from "@/features/access/components/details/AccessRecordHeader";
import { ACCESS_DETAILS_MOCK } from "@/features/access/data/accessDetails.mock";
import { ACCESS_POINTS_MOCK } from "@/features/access/data/accessPoints.mock";
import { findAccessDetails } from "@/features/access/utils/accessDetails";

interface AccessDetailsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

/** Shared by all pages of one access record: the header above, then the page. Unknown ids give a 404. */
export default async function AccessDetailsLayout({ children, params }: AccessDetailsLayoutProps) {
	const { id } = await params;
	const details = findAccessDetails(id, ACCESS_POINTS_MOCK, ACCESS_DETAILS_MOCK);
	if (!details) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<AccessRecordHeader id={details.id} idNumber={details.idNumber} />
			{children}
		</div>
	);
}
