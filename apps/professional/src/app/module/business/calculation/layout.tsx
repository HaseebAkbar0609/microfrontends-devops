import { CalculationModuleHeader } from "@/features/calculation/components/CalculationModuleHeader";

export default function CalculationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col">
			<CalculationModuleHeader />
			{children}
		</div>
	);
}
