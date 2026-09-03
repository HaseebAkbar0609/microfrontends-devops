import React from "react";
import { ExpenseDetailPage } from "@/features/financial-management";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ExpenseDetailRoute({ params }: PageProps) {
	const { id } = await params;
	return <ExpenseDetailPage expenseId={id} />;
}
