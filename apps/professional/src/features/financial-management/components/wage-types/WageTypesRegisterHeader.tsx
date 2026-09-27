"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ARTICLE_OVERVIEW_BASE_ROUTE } from "../../constants/article.constants";
import { CUSTOMER_OVERVIEW_BASE_ROUTE } from "../../constants/customerOverview.constants";
import { SUPPLIER_OVERVIEW_BASE_ROUTE } from "../../constants/supplierOverview.constants";
import { PRICE_LISTS_BASE_ROUTE } from "../../constants/priceLists.constants";
import { ACCOUNT_PLAN_BASE_ROUTE } from "../../constants/accountPlan.constants";
import { COST_CENTERS_BASE_ROUTE } from "../../constants/costCenters.constants";
import { WAGE_TYPES_BASE_ROUTE } from "../../constants/wageTypes.constants";

export function WageTypesRegisterHeader() {
	const router = useRouter();

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-9 px-2.5 py-1 text-base font-bold text-slate-900 hover:bg-slate-100 gap-1.5 cursor-pointer"
						>
							<span>
								<Translate text={localizationConstants.register} />
							</span>
							<span className="text-slate-400 font-normal">/</span>
							<span className="font-semibold text-slate-800">
								<Translate text={localizationConstants.wageTypes} />
							</span>
							<ChevronDown className="h-4 w-4 text-slate-500 ml-1" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={() => router.push(ARTICLE_OVERVIEW_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.registerArtiklar} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(CUSTOMER_OVERVIEW_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.customerRegister} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(SUPPLIER_OVERVIEW_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.supplierRegister} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.priceList} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(ACCOUNT_PLAN_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.accountPlan} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(COST_CENTERS_BASE_ROUTE)}
							className="text-xs cursor-pointer py-2 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.costCentre} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push(WAGE_TYPES_BASE_ROUTE)}
							className="text-xs font-semibold cursor-pointer py-2 bg-slate-50 text-slate-900 focus:bg-slate-100"
						>
							<Translate text={localizationConstants.wageTypes} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
