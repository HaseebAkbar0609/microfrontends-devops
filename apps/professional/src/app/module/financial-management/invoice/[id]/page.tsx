import React from "react";
import { InvoiceDetailPage } from "@/features/financial-management/components/invoice-detail/InvoiceDetailPage";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function InvoiceDetailRoute({ params }: PageProps) {
	const { id } = await params;
	return <InvoiceDetailPage invoiceId={id} />;
}
