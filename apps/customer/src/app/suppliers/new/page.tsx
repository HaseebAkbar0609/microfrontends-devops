"use client";

import { CreateSupplierView } from "@/features/suppliers/components/CreateSupplierView";
import { useRouter } from "next/navigation";

export default function NewSupplierRoute() {
	const router = useRouter();

	const handleBack = () => {
		router.push("/suppliers");
	};

	const handleSuccess = () => {
		router.push("/suppliers");
	};

	return (
		<CreateSupplierView
			onBack={handleBack}
			onSuccess={handleSuccess}
		/>
	);
}
