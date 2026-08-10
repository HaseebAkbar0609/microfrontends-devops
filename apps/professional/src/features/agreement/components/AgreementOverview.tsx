"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { AgreementOverviewTable } from "./AgreementOverviewTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DUMMY_AGREEMENTS } from "../constants/agreementList";
import localizationConstants from "@/utils/translation/constants";
import { Agreement } from "../types/agreement";
import { Loader } from "@/components/ui/loader";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useRouter } from "next/navigation";
import { AGREEMENT_ROUTES } from "../constants/agreementDashboard";

export default function AgreementOverview() {
	const t = useTranslate();
	const { search, changeQuery, page = 1, query } = useQueryParams();
	const page_size = query.get("page_size") || "10";
	const [agreements, setAgreements] = useState<Agreement[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function fetchAgreements() {
			setIsLoading(true);
			try {
				const filtered = DUMMY_AGREEMENTS.filter((a) => {
					if (!search) return true;
					const q = search.toLowerCase();
					return (
						a.idNumber.toLowerCase().includes(q) ||
						a.object.toLowerCase().includes(q) ||
						a.department.toLowerCase().includes(q) ||
						a.counterparty.toLowerCase().includes(q)
					);
				});
				setAgreements(filtered);
				setTotalItems(filtered.length);
			} catch {
				setAgreements(DUMMY_AGREEMENTS);
				setTotalItems(DUMMY_AGREEMENTS.length);
			} finally {
				setIsLoading(false);
			}
		}
		fetchAgreements();
	}, [search, page, page_size]);

	return (
		<div className="flex flex-1 flex-col">
			<div className="flex flex-col gap-3 px-3 pt-2 pb-1 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<div className="flex items-center gap-3 flex-1">
					<Search
						value={search}
						onChange={(val) => changeQuery("search", val)}
						placeholder={t(localizationConstants.agreementOverviewSearchPlaceholder)}
						className="h-10 w-full max-w-70 shrink-0"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="cursor-pointer h-10 gap-2 border-border text-secondary font-medium bg-white shrink-0"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem>
								<Translate text={localizationConstants.agreementOverviewColDepartment} />
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Translate text={localizationConstants.agreementOverviewColStatus} />
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Translate text={localizationConstants.agreementOverviewColCounterparty} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Button
					onClick={() => router.push(AGREEMENT_ROUTES.create)}
					className="cursor-pointer h-10 px-5 gap-2 rounded-md bg-[#18181B] hover:bg-[#18181B]/90 text-white font-medium shrink-0 w-auto self-start sm:self-auto"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.agreementOverviewNewBtn} />
				</Button>
			</div>

			<div className="px-3 sm:px-5 pt-3 pb-3 flex-1">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Loader />
					</div>
				) : (
					<AgreementOverviewTable data={agreements} totalItems={totalItems} />
				)}
			</div>
		</div>
	);
}
