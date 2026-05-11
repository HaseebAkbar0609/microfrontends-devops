import { Suspense } from "react";
import CreateOfferPage from "@/features/quote/components/CreateOfferPage";
import { Loader2 } from "lucide-react";

function CreateOfferFallback() {
	return (
		<div className="flex min-h-[40vh] flex-1 items-center justify-center bg-slate-50">
			<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<CreateOfferFallback />}>
			<CreateOfferPage />
		</Suspense>
	);
}
