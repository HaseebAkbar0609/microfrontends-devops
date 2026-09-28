"use client";

import { ReactNode, useEffect, useMemo, useState, KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contact, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getAdminUserOptions } from "@/features/admin/users/api/adminUsers.api";
import {
	useLeadManagement,
	useUpdateLeadManagement,
} from "../hooks/useCompanyInformation";
import {
	getCities,
	getProfessionalCategoriesHierarchical,
} from "../api/referenceData.api";
import LeadMultiSelect from "./LeadMultiSelect";

const toggleIn = (list: string[], value: string): string[] =>
	list.includes(value)
		? list.filter((item) => item !== value)
		: [...list, value];

const LeadField = ({
	labelKey,
	children,
	addTag,
	onAddRow,
}: {
	labelKey: string;
	children: ReactNode;
	// Present only for ad-hoc tag fields (mail, district) -- category/city
	// options come from a real catalog, so there's nothing to type in here.
	addTag?: {
		onAdd: (value: string) => void;
		placeholder: string;
	};
	// Phone only: appends another blank input row below, which the admin
	// then types straight into -- there's no separate value to "add" first.
	onAddRow?: () => void;
}) => {
	const [draft, setDraft] = useState("");

	const commit = () => {
		const value = draft.trim();
		if (!value || !addTag) return;
		addTag.onAdd(value);
		setDraft("");
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />{" "}
				<span aria-hidden className="text-red-500">
					*
				</span>
			</label>
			{children}
			{addTag && (
				<div className="flex items-center gap-2">
					<Input
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
							if (event.key === "Enter") {
								event.preventDefault();
								commit();
							}
						}}
						placeholder={addTag.placeholder}
						className="h-10 border-slate-200 text-sm"
					/>
					<Button
						type="button"
						onClick={commit}
						disabled={!draft.trim()}
						className="h-10 w-fit shrink-0 gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.companyLeadsAddNew} />
					</Button>
				</div>
			)}
			{onAddRow && (
				<Button
					type="button"
					onClick={onAddRow}
					className="h-10 w-fit gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.companyLeadsAddNew} />
				</Button>
			)}
		</div>
	);
};

interface LeadManagementState {
	phones: string[];
	emails: string[];
	mainCategories: string[];
	subCategories: string[];
	cities: string[];
	districts: string[];
}

const EMPTY_STATE: LeadManagementState = {
	phones: [""],
	emails: [],
	mainCategories: [],
	subCategories: [],
	cities: [],
	districts: [],
};

export function CompanyLeadManagementTab() {
	const t = useTranslate();
	const leadManagementQuery = useLeadManagement();
	const updateLeadManagement = useUpdateLeadManagement();

	const categoriesQuery = useQuery({
		queryKey: ["professional-categories", "hierarchical"],
		queryFn: getProfessionalCategoriesHierarchical,
		staleTime: 5 * 60 * 1000,
	});
	const citiesQuery = useQuery({
		queryKey: ["cities"],
		queryFn: getCities,
		staleTime: 5 * 60 * 1000,
	});
	const staffQuery = useQuery({
		queryKey: ["admin-users", "options"],
		queryFn: () => getAdminUserOptions({ limit: 100 }),
	});

	const categories = useMemo(
		() => categoriesQuery.data ?? [],
		[categoriesQuery.data],
	);
	const mainCategoryOptions = useMemo(
		() => categories.map((category) => category.name),
		[categories],
	);
	const cityOptions = useMemo(
		() => (citiesQuery.data ?? []).map((city) => city.name),
		[citiesQuery.data],
	);
	const staffEmailOptions: string[] = useMemo(
		() =>
			(staffQuery.data?.data ?? []).map(
				(user: { email: string }) => user.email,
			),
		[staffQuery.data],
	);

	const [state, setState] = useState<LeadManagementState>(EMPTY_STATE);

	// Only offer subcategories that belong to a currently selected main
	// category -- picking from all of them regardless would defeat the point
	// of narrowing by main category first.
	const subCategoryOptions = useMemo(() => {
		const names = new Set<string>();
		for (const category of categories) {
			if (state.mainCategories.includes(category.name)) {
				for (const sub of category.subcategories) names.add(sub.name);
			}
		}
		return Array.from(names);
	}, [categories, state.mainCategories]);

	// Mail's own options are a mix of the company's real staff emails and any
	// manually added addresses (e.g. a shared inbox) -- the multi-select's
	// option list must include both, not just whichever the admin toggled.
	const emailOptions = useMemo(
		() => Array.from(new Set([...staffEmailOptions, ...state.emails])),
		[staffEmailOptions, state.emails],
	);

	useEffect(() => {
		if (!leadManagementQuery.data) return;
		const data = leadManagementQuery.data;
		setState({
			phones: data.phones?.length ? data.phones : [""],
			emails: data.emails ?? [],
			mainCategories: data.mainCategories ?? [],
			subCategories: data.subCategories ?? [],
			cities: data.cities ?? [],
			districts: data.districts ?? [],
		});
	}, [leadManagementQuery.data]);

	const handleReset = () => {
		if (!leadManagementQuery.data) {
			setState(EMPTY_STATE);
			return;
		}
		const data = leadManagementQuery.data;
		setState({
			phones: data.phones?.length ? data.phones : [""],
			emails: data.emails ?? [],
			mainCategories: data.mainCategories ?? [],
			subCategories: data.subCategories ?? [],
			cities: data.cities ?? [],
			districts: data.districts ?? [],
		});
	};

	const handleSave = async () => {
		try {
			await updateLeadManagement.mutateAsync({
				...state,
				phones: state.phones.filter((phone) => phone.trim().length > 0),
			});
			showToast("success", t(localizationConstants.profileUpdated));
		} catch (_error) {
			showToast("error", t(localizationConstants.profileUpdateFailed));
		}
	};

	// Adds a real, admin-typed value -- both selected and, via emailOptions
	// above (which unions in state.emails), part of that field's own option
	// list from then on.
	const addTagTo = (key: "emails" | "districts") => (value: string) =>
		setState((current) =>
			current[key].includes(value)
				? current
				: { ...current, [key]: [...current[key], value] },
		);

	return (
		<div className="flex min-h-[calc(100vh-320px)] flex-col gap-6">
			<CollapsibleSection
				className="rounded-md border border-slate-200 bg-white py-4"
				contentClassName="px-5"
				icon={<Contact size={24} className="text-slate-700" />}
				title={<Translate text={localizationConstants.companyLeadsTitle} />}
				defaultOpen
			>
				<div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
					<LeadField
						labelKey={localizationConstants.companyLeadsPhone}
						onAddRow={() =>
							setState((current) => ({
								...current,
								phones: [...current.phones, ""],
							}))
						}
					>
						<div className="flex flex-col gap-2">
							{state.phones.map((phone, index) => (
								<Input
									// Position-keyed: rows are append-only text
									// inputs with no identity of their own.
									key={`phone-${index}`}
									value={phone}
									onChange={(event) =>
										setState((current) => ({
											...current,
											phones: current.phones.map(
												(item, itemIndex) =>
													itemIndex === index
														? event.target.value
														: item,
											),
										}))
									}
									className="h-11 border-slate-200 text-sm"
								/>
							))}
						</div>
					</LeadField>

					<LeadField
						labelKey={localizationConstants.companyLeadsMail}
						addTag={{
							onAdd: addTagTo("emails"),
							placeholder: "name@company.se",
						}}
					>
						<LeadMultiSelect
							options={emailOptions}
							selected={state.emails}
							onToggle={(option) =>
								setState((current) => ({
									...current,
									emails: toggleIn(current.emails, option),
								}))
							}
						/>
					</LeadField>

					<LeadField
						labelKey={
							localizationConstants.companyLeadsMainCategory
						}
					>
						<LeadMultiSelect
							options={mainCategoryOptions}
							selected={state.mainCategories}
							onToggle={(option) =>
								setState((current) => ({
									...current,
									mainCategories: toggleIn(
										current.mainCategories,
										option,
									),
								}))
							}
							showHeader
						/>
					</LeadField>

					<LeadField labelKey={localizationConstants.companyLeadsCity}>
						<LeadMultiSelect
							options={cityOptions}
							selected={state.cities}
							onToggle={(option) =>
								setState((current) => ({
									...current,
									cities: toggleIn(current.cities, option),
								}))
							}
						/>
					</LeadField>

					<LeadField
						labelKey={
							localizationConstants.companyLeadsSubCategory
						}
					>
						<LeadMultiSelect
							options={subCategoryOptions}
							selected={state.subCategories}
							onToggle={(option) =>
								setState((current) => ({
									...current,
									subCategories: toggleIn(
										current.subCategories,
										option,
									),
								}))
							}
							showHeader
						/>
					</LeadField>

					<LeadField
						labelKey={localizationConstants.companyLeadsDistrict}
						addTag={{
							onAdd: addTagTo("districts"),
							placeholder: "Södermalm",
						}}
					>
						<LeadMultiSelect
							options={state.districts}
							selected={state.districts}
							onToggle={(option) =>
								setState((current) => ({
									...current,
									districts: toggleIn(
										current.districts,
										option,
									),
								}))
							}
						/>
					</LeadField>
				</div>
			</CollapsibleSection>

			<div className="sticky bottom-0 mt-auto -mx-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						className="w-full border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)] sm:w-52"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						disabled={updateLeadManagement.isPending}
						className="w-full bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)] sm:w-52"
					>
						<Save size={16} />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</div>
		</div>
	);
}
