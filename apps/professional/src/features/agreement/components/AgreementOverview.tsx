"use client";

import { useEffect, useState, useCallback } from "react";
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
import { getAgreementsListAction, getAgreementDepartmentsAction, updateAgreementAction, deleteAgreementAction } from "@/api-actions/agreements/agreements";
import localizationConstants from "@/utils/translation/constants";
import { Agreement } from "../types/agreement";
import { Loader } from "@/components/ui/loader";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useRouter } from "next/navigation";
import { AGREEMENT_ROUTES } from "../constants/agreementDashboard";

export default function AgreementOverview() {
	const t = useTranslate();
	const { search, changeQuery, changeQueries, page = 1, query } = useQueryParams();
	const page_size = query.get("page_size") || "10";
	const sort_by = query.get("sort_by") || undefined;
	const sort_order = query.get("sort_order") || "asc";
	const department = query.get("department") || undefined;
	const status = query.get("status") || undefined;

	const [agreements, setAgreements] = useState<Agreement[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [departments, setDepartments] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function fetchDepartments() {
			try {
				const res = await getAgreementDepartmentsAction();
				if (res.success && res.data) {
					setDepartments(res.data);
				}
			} catch {
				setDepartments([]);
			}
		}
		fetchDepartments();
	}, []);

	const fetchAgreements = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAgreementsListAction({
				search: search || undefined,
				skip: (Number(page) - 1) * Number(page_size),
				limit: Number(page_size),
				sort_by,
				sort_dir: sort_order,
				department,
				status,
			});
			if (res.success && res.data) {
				setAgreements(res.data.data);
				setTotalItems(res.data.totalItems);
			} else {
				setAgreements([]);
				setTotalItems(0);
			}
		} catch {
			setAgreements([]);
			setTotalItems(0);
		} finally {
			setIsLoading(false);
		}
	}, [search, page, page_size, sort_by, sort_order, department, status]);

	useEffect(() => {
		fetchAgreements();
	}, [fetchAgreements]);

	const handleFilterByDepartment = (value: string) => {
		changeQueries({ department: department === value ? null : value, page: "1" });
	};

	const handleFilterByStatus = (value: string) => {
		changeQueries({ status: status === value ? null : value, page: "1" });
	};

	const handleArchive = async (agreementId: string) => {
		const res = await updateAgreementAction(agreementId, { status: "archived" });
		if (res.success) {
			fetchAgreements();
		}
	};

	const handleDelete = async (agreementId: string) => {
		const res = await deleteAgreementAction(agreementId);
		if (res.success) {
			fetchAgreements();
		}
	};

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

					{/* Department filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className={`cursor-pointer h-10 gap-2 border-border font-medium bg-white shrink-0 ${department ? "text-primary border-primary" : "text-secondary"}`}
							>
								<Translate text={localizationConstants.agreementOverviewColDepartment} />
								<ChevronDown className="h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{departments.map((dep) => (
								<DropdownMenuItem
									key={dep}
									className={`cursor-pointer ${department === dep ? "font-semibold text-primary" : ""}`}
									onClick={() => handleFilterByDepartment(dep)}
								>
									{dep}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Status filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className={`cursor-pointer h-10 gap-2 border-border font-medium bg-white shrink-0 ${status ? "text-primary border-primary" : "text-secondary"}`}
							>
								<Translate text={localizationConstants.agreementOverviewColStatus} />
								<ChevronDown className="h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{[
								{ value: "active", label: localizationConstants.agreementOverviewStatusAktiv },
								{ value: "draft", label: localizationConstants.agreementOverviewStatusDraft },
								{ value: "expired", label: localizationConstants.agreementOverviewStatusForfallna },
								{ value: "terminated", label: localizationConstants.agreementOverviewStatusAvslutade },
							].map((s) => (
								<DropdownMenuItem
									key={s.value}
									className={`cursor-pointer ${status === s.value ? "font-semibold text-primary" : ""}`}
									onClick={() => handleFilterByStatus(s.value)}
								>
									<Translate text={s.label} />
								</DropdownMenuItem>
							))}
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
					<AgreementOverviewTable
						data={agreements}
						totalItems={totalItems}
						onArchive={handleArchive}
						onDelete={handleDelete}
					/>
				)}
			</div>
		</div>
	);
}
