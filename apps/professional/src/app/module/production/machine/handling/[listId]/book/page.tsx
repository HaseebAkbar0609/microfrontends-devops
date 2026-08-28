import { BookMachinePage } from "@/features/machines/handling/book/BookMachinePage";

interface BookMachineRouteProps {
	params: Promise<{ listId: string }>;
}

export default async function Page({ params }: BookMachineRouteProps) {
	const { listId } = await params;
	return <BookMachinePage listId={listId} />;
}
