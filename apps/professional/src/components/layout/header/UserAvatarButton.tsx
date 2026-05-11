"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useAuthStatus } from "@/context/AuthContext";

import { Plus, ArrowRight, Smile } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface UserAvatarButtonProps {
	name?: string;
	role?: string;
	initials?: string;
	className?: string;
}

const UserAvatarButton = ({
	initials = "OR",
	className,
}: UserAvatarButtonProps) => {
	const { company } = useAuthStatus();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Open user menu"
					className={cn(
						"flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white shadow-sm hover:opacity-90 cursor-pointer",
						className,
					)}
				>
					{initials}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-72 p-2">
				{/* CURRENT COMPANY */}
				<div className="px-2 py-2">
					<p className="text-sm uppercase font-semibold text-slate-700 mb-2">
						<Translate text={localizationConstants.companies} />
					</p>

					<DropdownMenuItem className="flex justify-between rounded-lg bg-gray-200 ">
						<div className="flex items-center gap-2">
							<Smile
								size={24}
								className="text-slate-700"
								strokeWidth={2}
							/>
							<span className="text-sm capitalize font-medium text-slate-900">
								{company?.company_name || "-"}
							</span>
						</div>

						<ArrowRight
							size={20}
							className="text-slate-700"
							strokeWidth={2}
						/>
					</DropdownMenuItem>
				</div>

				{/* CHANGE COMPANY */}
				{/* <div className="px-2 pb-2">
					<p className="text-sm font-semibold text-slate-700 mb-2">
						<Translate text={localizationConstants.changeCompany} />
					</p>

					{companies.map((company) => (
						<DropdownMenuItem
							key={company}
							className="flex justify-between rounded-lg "
						>
							<div className="flex items-center gap-2">
								<Smile
									size={24}
									className="text-slate-700"
									strokeWidth={2}
								/>
								<span className="text-sm">
									<Translate text={company} />
								</span>
							</div>

							<ArrowRight
								size={20}
								className="text-slate-700"
								strokeWidth={2}
							/>
						</DropdownMenuItem>
					))}
				</div> */}

				{/* ADD ACCOUNT */}
				<DropdownMenuItem className="gap-2 p-3 flex justify-center">
					<Plus size={20} className="text-slate-900" />
					<span className="text-slate-900 font-semibold text-sm">
						<Translate text={localizationConstants.addAccount} />
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatarButton;
