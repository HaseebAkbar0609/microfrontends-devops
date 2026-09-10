import { ExpenseDetailPage } from "@/features/financial-management";

interface PageProps {
	params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function SupplierInvoiceDetailRoute({ params }: PageProps) {
	const { id } = await params;
	return <ExpenseDetailPage expenseId={id} />;
}