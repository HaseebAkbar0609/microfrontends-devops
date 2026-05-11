import { cn } from "@/lib/utils";
import Image from "next/image";
interface CompanyLogoProps {
	name: string;
	className?: string;
	logoUrl?: string | null;
}

const CompanyLogo = ({ name, className, logoUrl }: CompanyLogoProps) => {
	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			{logoUrl ? (
				<Image
					src={logoUrl}
					alt={name}
					width={36}
					height={36}
					className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-contain"
				/>
			) : (
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						className="h-5 w-5 text-white"
						aria-hidden="true"
					>
						<path
							d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
							stroke="currentColor"
							strokeWidth="2.2"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			)}

			<span className="text-base font-semibold text-slate-900 capitalize">
				{name}
			</span>
		</div>
	);
};

export default CompanyLogo;
