import { CreateForfragnPage } from "@/features/calculation/components/CreateForfragnPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <CreateForfragnPage calcId={id} />;
}
