import { redirect } from "next/navigation";
import { EXPENSE_DETAIL_ROUTE } from "@/features/financial-management/constants/expense.constants";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-dynamic";

export default async function ExpenseDetailRoute({ params }: PageProps) {
	const { id } = await params;
	redirect(EXPENSE_DETAIL_ROUTE(id));
}
