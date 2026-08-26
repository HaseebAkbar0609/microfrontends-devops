import { MachineListDetailPage } from "@/features/machines/handling/MachineListDetailPage";

interface MachineListDetailRouteProps {
	params: Promise<{ listId: string }>;
}

export default async function Page({ params }: MachineListDetailRouteProps) {
	const { listId } = await params;
	return <MachineListDetailPage listId={listId} />;
}
