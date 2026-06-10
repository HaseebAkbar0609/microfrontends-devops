import { ReactNode } from "react";
import { LucideIcon, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";

interface DetailCardProps {
	icon: LucideIcon;
	title: string;
	children: ReactNode;
	className?: string;
	status?: boolean;
	onEdit?: () => void;
}

export function DetailCard({
	icon: Icon,
	title,
	children,
	className,
	status,
	onEdit,
}: DetailCardProps) {
	return (
		<Card
			className={`border shadow-none rounded-xl overflow-hidden bg-white p-0 ${className}`}
		>
			<CardHeader className="border-b border-gray-250 flex flex-row items-center gap-2 !p-4">
				<Icon className="h-5 w-5" />
				<CardTitle className="text-lg font-semibold text-slate-900 flex-1">
					<Translate text={title} />
				</CardTitle>
				{onEdit && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="gap-2"
						onClick={onEdit}
					>
						<Pencil className="h-4 w-4" />
						Edit
					</Button>
				)}
				{status && (
					<div className="flex items-center gap-1.5 bg-slate-900 rounded-lg px-2.5 py-1.5 ml-auto">
						<div className={`w-5 h-5 rounded-full bg-[#f87171]`} />
						<div className={`w-5 h-5 rounded-full bg-[#facc15]`} />
						<div className={`w-5 h-5 rounded-full bg-[#4ade80]`} />
					</div>
				)}
			</CardHeader>
			<CardContent className="pb-6">{children}</CardContent>
		</Card>
	);
}
