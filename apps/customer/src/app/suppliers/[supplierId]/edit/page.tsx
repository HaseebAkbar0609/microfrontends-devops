"use client";

import { useParams, useRouter } from "next/navigation";
import { EditSupplierView } from "@/features/suppliers/components/EditSupplierView";

export default function EditSupplierRoute() {
	const params = useParams();
	const router = useRouter();
	const supplierId = params.supplierId as string;

	const handleBack = () => {
		router.push("/suppliers");
	};

	const handleSuccess = () => {
		router.push("/suppliers");
	};

	return (
		<EditSupplierView
			supplierId={supplierId}
			onBack={handleBack}
			onSuccess={handleSuccess}
		/>
	);
}
