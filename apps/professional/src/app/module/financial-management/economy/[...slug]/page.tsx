import { notFound } from "next/navigation";
import { ComingSoonPage } from "@/features/financial-management";
import { ECONOMY_SECTIONS } from "@/features/financial-management/constants/economyNav.config";

interface PageProps {
	params: Promise<{ slug: string[] }>;
}

export default async function EconomyComingSoonRoute({ params }: PageProps) {
	const { slug } = await params;
	const section = ECONOMY_SECTIONS.find((item) => item.id === slug[0]);

	if (!section || section.implemented) {
		notFound();
	}

	return <ComingSoonPage titleKey={section.labelKey} />;
}