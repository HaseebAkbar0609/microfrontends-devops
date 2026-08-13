"use client";

import { ReactNode, useState } from "react";
import { Contact, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	LEAD_CITY_OPTIONS,
	LEAD_DEFAULT_CITIES,
	LEAD_DEFAULT_DISTRICTS,
	LEAD_DEFAULT_MAILS,
	LEAD_DEFAULT_MAIN_CATEGORIES,
	LEAD_DEFAULT_PHONE,
	LEAD_DEFAULT_SUB_CATEGORIES,
	LEAD_DISTRICT_OPTIONS,
	LEAD_MAIL_OPTIONS,
	LEAD_MAIN_CATEGORY_OPTIONS,
	LEAD_SUB_CATEGORY_OPTIONS,
} from "../constants/leadManagementMock";
import LeadMultiSelect from "./LeadMultiSelect";

// Builds the next mock option name ("Städ 1", "Städ 2", …) without colliding
// with existing entries — mirrors the numbered duplicates in the figma.
const nextMockOption = (options: string[]): string => {
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

export function CompanyLeadManagementTab() {
	const t = useTranslate();
	// Static phase: everything is UI state only until the backend exposes a
	// lead-management endpoint.
	const [phones, setPhones] = useState<string[]>([LEAD_DEFAULT_PHONE]);
	const [mailOptions, setMailOptions] = useState(LEAD_MAIL_OPTIONS);
	const [mails, setMails] = useState(LEAD_DEFAULT_MAILS);
	const [mainCategoryOptions, setMainCategoryOptions] = useState(
		LEAD_MAIN_CATEGORY_OPTIONS,
	);
	const [mainCategories, setMainCategories] = useState(
		LEAD_DEFAULT_MAIN_CATEGORIES,
	);
	const [subCategoryOptions, setSubCategoryOptions] = useState(
		LEAD_SUB_CATEGORY_OPTIONS,
	);
	const [subCategories, setSubCategories] = useState(
		LEAD_DEFAULT_SUB_CATEGORIES,
	);
	const [cityOptions, setCityOptions] = useState(LEAD_CITY_OPTIONS);
	const [cities, setCities] = useState(LEAD_DEFAULT_CITIES);
	const [districtOptions, setDistrictOptions] = useState(
		LEAD_DISTRICT_OPTIONS,
	);
	const [districts, setDistricts] = useState(LEAD_DEFAULT_DISTRICTS);

	const handleReset = () => {
		setPhones([LEAD_DEFAULT_PHONE]);
		setMailOptions(LEAD_MAIL_OPTIONS);
		setMails(LEAD_DEFAULT_MAILS);
		setMainCategoryOptions(LEAD_MAIN_CATEGORY_OPTIONS);
		setMainCategories(LEAD_DEFAULT_MAIN_CATEGORIES);
		setSubCategoryOptions(LEAD_SUB_CATEGORY_OPTIONS);
		setSubCategories(LEAD_DEFAULT_SUB_CATEGORIES);
		setCityOptions(LEAD_CITY_OPTIONS);
		setCities(LEAD_DEFAULT_CITIES);
		setDistrictOptions(LEAD_DISTRICT_OPTIONS);
		setDistricts(LEAD_DEFAULT_DISTRICTS);
	};

	// Static phase: the backend has no lead-management endpoint yet, so Spara
	// only confirms the local UI state. When the API lands, replace this with
	// a mutation + error toast following the CompanyDetail.onSubmit pattern.
	const handleSave = () => {
		showToast("success", t(localizationConstants.profileUpdated));
	};

	const addOptionTo =
		(
			setOptions: (updater: (current: string[]) => string[]) => void,
		) =>
		() =>
			setOptions((current) => [...current, nextMockOption(current)]);

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
						onAdd={() => setPhones((current) => [...current, ""])}
					>
						<div className="flex flex-col gap-2">
							{phones.map((phone, index) => (
								<Input
									// Position-keyed: rows are append-only text
									// inputs with no identity of their own.
									key={`phone-${index}`}
									value={phone}
									onChange={(event) =>
										setPhones((current) =>
											current.map((item, itemIndex) =>
												itemIndex === index
													? event.target.value
													: item,
											),
										)
									}
									className="h-11 border-slate-200 text-sm"
								/>
							))}
						</div>
					</LeadField>

					<LeadField
						labelKey={localizationConstants.companyLeadsMail}
						onAdd={addOptionTo(setMailOptions)}
					>
						<LeadMultiSelect
							options={mailOptions}
							selected={mails}
							onToggle={(option) =>
								setMails((current) =>
									toggleIn(current, option),
								)
							}
						/>
					</LeadField>

					<LeadField
						labelKey={
							localizationConstants.companyLeadsMainCategory
						}
						onAdd={addOptionTo(setMainCategoryOptions)}
					>
						<LeadMultiSelect
							options={mainCategoryOptions}
							selected={mainCategories}
							onToggle={(option) =>
								setMainCategories((current) =>
									toggleIn(current, option),
								)
							}
							showHeader
						/>
					</LeadField>

					<LeadField
						labelKey={localizationConstants.companyLeadsCity}
						onAdd={addOptionTo(setCityOptions)}
					>
						<LeadMultiSelect
							options={cityOptions}
							selected={cities}
							onToggle={(option) =>
								setCities((current) =>
									toggleIn(current, option),
								)
							}
						/>
					</LeadField>

					<LeadField
						labelKey={
							localizationConstants.companyLeadsSubCategory
						}
						onAdd={addOptionTo(setSubCategoryOptions)}
					>
						<LeadMultiSelect
							options={subCategoryOptions}
							selected={subCategories}
							onToggle={(option) =>
								setSubCategories((current) =>
									toggleIn(current, option),
								)
							}
							showHeader
						/>
					</LeadField>

					<LeadField
						labelKey={localizationConstants.companyLeadsDistrict}
						onAdd={addOptionTo(setDistrictOptions)}
					>
						<LeadMultiSelect
							options={districtOptions}
							selected={districts}
							onToggle={(option) =>
								setDistricts((current) =>
									toggleIn(current, option),
								)
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
