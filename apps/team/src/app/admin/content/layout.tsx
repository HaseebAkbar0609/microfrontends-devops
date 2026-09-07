import type { ReactNode } from "react";
import { ContentProvider } from "@/features/content/context/ContentProvider";

/**
 * Holds the content console for every page below it, so rows and guide edits
 * survive moving between groups and sections.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
	return <ContentProvider>{children}</ContentProvider>;
}
