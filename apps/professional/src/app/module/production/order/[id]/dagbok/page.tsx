import { redirect } from "next/navigation";

interface DagbokRedirectPageProps {
	params: Promise<{ id: string }>;
}

export default async function DagbokRedirectPage({
	params,
}: DagbokRedirectPageProps) {
	const { id } = await params;
	redirect(`/module/production/order/${id}/construction-log`);
}
