import { AccessNewHeader } from "@/features/access/components/new/AccessNewHeader";
import { AccessNewDraftProvider } from "@/features/access/context/AccessNewDraftContext";

/** The new-access wizard: one draft shared by both steps, under a shared header. */
export default function AccessNewLayout({ children }: { children: React.ReactNode }) {
	return (
		<AccessNewDraftProvider>
			<div className="flex flex-1 flex-col bg-blue-gray-50">
				<AccessNewHeader />
				{children}
			</div>
		</AccessNewDraftProvider>
	);
}
