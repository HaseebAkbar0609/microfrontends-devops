"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import {
	ArrowLeft,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

const items = [
	{
		id: "employment",
		labelKey: "myPagesEmployment",
		href: "/tools/my-pages/employment",
		
	},
	{
		id: "company",
		labelKey: "myPagesCompany",
		href: "/tools/my-pages/company",
		
	},
	{
		id: "time",
		labelKey: "myPagesTime",
		href: "/tools/my-pages/time",
	
	},
	{
		id: "it-support",
		labelKey: "myPagesItSupport",
		href: "/tools/my-pages/it-support",
		
	},
	{
		id: "profile-settings",
		labelKey: "myPagesProfileSettings",
		href: "/tools/my-pages/profile-settings",
		
	},
];

export default function MyPagesSubSidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
	const pathname = usePathname();
	const backLabelId = useId();

	return (
		<aside className={`sticky top-0 flex h-full shrink-0 flex-col border-r border-slate-200 bg-slate-100/80 ${mobile ? "w-full" : "w-64"}`}>
			<div className="flex h-16 w-full items-center border-b border-slate-200 gap-3 px-3 sm:px-5">
				<Link
					href="/"
					onClick={onNavigate}
					className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
					aria-labelledby={backLabelId}
				>
					<span id={backLabelId} className="sr-only">
						<Translate text="backToMainMenu" />
					</span>
					<ArrowLeft size={18} />
				</Link>
				<div className="text-lg font-semibold text-slate-900">
					<Translate text="myPages" />
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-2 px-3 py-4">
				{items.map((item) => {
					const isActive =
						pathname === item.href || pathname.startsWith(item.href + "/");
					
					return (
						<Link
							key={item.id}
							href={item.href}
							onClick={onNavigate}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
								isActive
									? "bg-slate-900 text-white shadow-sm"
									: "text-slate-600 hover:bg-slate-200"
							)}
						>
							
							<Translate text={item.labelKey} />
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-slate-200 px-4 py-3">
				<Link
					href="/"
					onClick={onNavigate}
					className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
				>
					<ArrowLeft size={16} />
					<Translate text="backToMainMenu" />
				</Link>
			</div>
		</aside>
	);
}
