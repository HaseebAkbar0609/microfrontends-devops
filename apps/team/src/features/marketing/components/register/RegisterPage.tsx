"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	findMarketingGroup,
	findMarketingSection,
	getSectionKey,
} from "../../constants/marketingGroups";
import { getMarketingSectionTabs } from "../../constants/marketingNav";
import { useMarketingRegisters } from "../../hooks/useMarketingRegisters";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useRegisterTable } from "../../hooks/useRegisterTable";
import type {
	MarketingGroupId,
	MarketingRow,
	MarketingSection,
} from "../../types";
import { MarketingModuleShell } from "../MarketingModuleShell";
import { RegisterFormDialog } from "./RegisterFormDialog";
import { RegisterTable } from "./RegisterTable";

type RegisterPageProps = {
	groupId: MarketingGroupId;
	sectionSlug: string;
};

/**
 * One register. The sub-sidebar selects the group and the section row the
 * register, so the module title is the same on all 19 pages.
 */
export default function RegisterPage({
	groupId,
	sectionSlug,
}: RegisterPageProps) {
	const group = findMarketingGroup(groupId);
	const section = group ? findMarketingSection(group, sectionSlug) : null;
	if (!group || !section) return null;

	const sectionKey = getSectionKey(group.id, section.slug);

	return (
		<MarketingModuleShell sectionTabs={getMarketingSectionTabs(group)}>
			{/* Keyed so switching registers rebuilds the form and the table state
			    against the new field config; the rows live in the provider. */}
			<RegisterWorkbench
				key={sectionKey}
				section={section}
				sectionKey={sectionKey}
			/>
		</MarketingModuleShell>
	);
}

function RegisterWorkbench({
	section,
	sectionKey,
}: {
	section: MarketingSection;
	sectionKey: string;
}) {
	const { getRows, removeRow } = useMarketingRegisters();
	const [dialogOpen, setDialogOpen] = useState(false);
	const t = useTranslate();

	const table = useRegisterTable(section, getRows(sectionKey));
	const registerForm = useRegisterForm(section, sectionKey, () =>
		setDialogOpen(false),
	);

	const openCreate = () => {
		registerForm.startCreating();
		setDialogOpen(true);
	};

	const openEdit = (row: MarketingRow) => {
		registerForm.startEditing(row);
		setDialogOpen(true);
	};

	const handleDelete = (row: MarketingRow) => {
		removeRow(sectionKey, row.id);
		showToast("success", t(localizationConstants.marketingRowDeletedToast));
	};

	return (
		<>
			<RegisterTable
				section={section}
				table={table}
				onCreate={openCreate}
				onEdit={openEdit}
				onDelete={handleDelete}
			/>
			<RegisterFormDialog
				section={section}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				registerForm={registerForm}
			/>
		</>
	);
}
