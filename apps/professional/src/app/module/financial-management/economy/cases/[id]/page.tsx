import { CaseDetailPage } from "@/features/financial-management/components/cases/detail";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <CaseDetailPage id={id} />;
}
