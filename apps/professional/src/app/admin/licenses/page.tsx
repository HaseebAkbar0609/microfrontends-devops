import { Suspense } from "react";
import AdminLicenses from "@/features/admin/licenses/components/AdminLicenses";

export default function Page() {
	return (
		<Suspense>
			<AdminLicenses />
		</Suspense>
	);
}
