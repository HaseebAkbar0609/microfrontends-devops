import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AcceptInvitationContent } from "@/features/auth/components/AcceptInvitationContent";

export const dynamic = "force-dynamic";

export default function AcceptInvitationPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center p-8">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			}
		>
			<AcceptInvitationContent />
		</Suspense>
	);
}
