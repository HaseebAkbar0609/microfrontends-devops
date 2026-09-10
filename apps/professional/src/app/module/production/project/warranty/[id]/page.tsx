import { notFound } from "next/navigation";
import { z } from "zod";

import ProjectWarrantyPage from "@/features/project/components/ProjectWarrantyPage";

/**
 * Warranty record ids are slugs like `5000-001`. Validating the shape here
 * keeps the pattern honest once this reads from an API rather than a mock,
 * where an unchecked path segment would reach a query.
 */
const recordIdSchema = z
	.string()
	.trim()
	.min(1)
	.max(64)
	.regex(/^[A-Za-z0-9_-]+$/);

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let decoded: string;
	try {
		decoded = decodeURIComponent(id);
	} catch {
		notFound();
	}

	const parsed = recordIdSchema.safeParse(decoded);
	if (!parsed.success) notFound();

	return <ProjectWarrantyPage recordId={parsed.data} />;
}
