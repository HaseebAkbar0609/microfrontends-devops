"use client";

import { ReactNode, useEffect, useState } from "react";
import { Contact, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	useLeadManagement,
	useUpdateLeadManagement,
} from "../hooks/useCompanyInformation";
import LeadMultiSelect from "./LeadMultiSelect";

// Builds the next option name ("Städ 1", "Städ 2", …) without colliding with
// existing entries when the admin adds a new tag.
const nextOptionName = (options: string[]): string => {
	const base = options[0] ?? "Ny";
	let counter = 1;
	while (options.includes(`${base} ${counter}`)) counter += 1;
	return `${base} ${counter}`;
};

const toggleIn = (list: string[], value: string): string[] =>
	list.includes(value)
		? list.filter((item) => item !== value)
		: [...list, value];

const LeadField = ({
	labelKey,
	onAdd,
	children,
}: {
	labelKey: string;
	onAdd: () => void;
	children: ReactNode;
}) => (
	<div className="flex flex-col gap-2">
		<label className="text-sm font-medium text-slate-900">
			<Translate text={labelKey} />{" "}
			<span aria-hidden className="text-red-500">
				*
			</span>
		</label>
		{children}
		<Button
			type="button"
			onClick={onAdd}
			className="h-10 w-fit gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
		>
			<Plus className="h-4 w-4" />
			<Translate text={localizationConstants.companyLeadsAddNew} />
		</Button>
	</div>
);

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

	const [state, setState] = useState<LeadManagementState>(EMPTY_STATE);

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

	const addOptionTo = (key: keyof LeadManagementState) => () =>
		setState((current) => {
			const values = current[key];
			const name = nextOptionName(values);
			return { ...current, [key]: [...values, name] };
		});

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
						onAdd={() =>
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
						onAdd={addOptionTo("emails")}
					>
						<LeadMultiSelect
							options={state.emails}
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
						onAdd={addOptionTo("mainCategories")}
					>
						<LeadMultiSelect
							options={state.mainCategories}
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

					<LeadField
						labelKey={localizationConstants.companyLeadsCity}
						onAdd={addOptionTo("cities")}
					>
						<LeadMultiSelect
							options={state.cities}
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
						onAdd={addOptionTo("subCategories")}
					>
						<LeadMultiSelect
							options={state.subCategories}
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
						onAdd={addOptionTo("districts")}
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
