import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem as BreadcrumbUIItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types/user";
import { Translate } from "@/utils/translation/translate";

interface PageHeaderProps {
	title: string;
	breadcrumbs?: BreadcrumbItem[];
	className?: string;
	children?: React.ReactNode;
	onBack?: () => void;
}

export function PageHeader({
	title,
	breadcrumbs,
	className,
	children,
	onBack,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 border-b border-slate-200  px-5 py-3",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				{onBack && (
					<button
						type="button"
						onClick={onBack}
						aria-label="Go back"
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
				)}
				<h1 className="text-2xl font-semibold text-[#0A0A0A] leading-tight">
					<Translate text={title} />
				</h1>
			</div>

			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumb>
					<BreadcrumbList className="flex items-center flex-wrap gap-1">
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							return (
								<BreadcrumbUIItem
									key={`${item.label}-${index}`}
									className="flex items-center gap-1"
								>
									{index !== 0 && <BreadcrumbSeparator />}
									{isLast ? (
										<BreadcrumbPage className="text-sm font-normal text-slate-800">
											<Translate text={item.label} />
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link
												href={item.href || "#"}
												className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
											>
												<Translate text={item.label} />
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbUIItem>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}
			{children}
		</div>
	);
}
