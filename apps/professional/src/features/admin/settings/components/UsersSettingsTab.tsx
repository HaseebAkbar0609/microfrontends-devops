"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const ADMIN_TOGGLE_ROWS = [
	{ id: "add-users", labelKey: localizationConstants.settingsUsersAddUsers },
	{
		id: "add-licenses",
		labelKey: localizationConstants.settingsUsersAddLicenses,
	},
	{
		id: "change-permissions",
		labelKey: localizationConstants.settingsUsersChangePermissions,
	},
	{
		id: "terminate-licenses",
		labelKey: localizationConstants.settingsUsersTerminateLicenses,
	},
] as const;

const UsersSettingsTab = () => {
	const [toggles, setToggles] = useState<Record<string, boolean>>({});

	return (
		<div className="rounded-md border border-slate-200 bg-white p-6">
			<h2 className="text-lg font-semibold text-slate-500">
				<Translate text={localizationConstants.settingsUsersSysAdmin} />
			</h2>
			<div className="mt-4 grid grid-cols-1 items-center gap-2 border-b border-slate-200 pb-5 sm:grid-cols-[minmax(0,24rem)_1fr]">
				<span className="text-sm text-slate-900">
					<Translate
						text={localizationConstants.settingsUsersFullAccess}
					/>
				</span>
				<RadioGroup
					value="wholeSystem"
					disabled
					className="[--primary:var(--color-primary-black)]"
				>
					<label className="flex items-center gap-2 text-sm text-slate-800">
						<RadioGroupItem
							value="wholeSystem"
							className="border-black"
						/>
						<Translate
							text={
								localizationConstants.settingsUsersWholeSystem
							}
						/>
					</label>
				</RadioGroup>
			</div>

			<h2 className="mt-5 text-lg font-semibold text-slate-500">
				<Translate text={localizationConstants.adminItem} />
			</h2>
			<div className="mt-4 flex flex-col gap-4">
				{ADMIN_TOGGLE_ROWS.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,24rem)_1fr]"
					>
						<span className="text-sm text-slate-900">
							<Translate text={row.labelKey} />
						</span>
						<div className="flex items-center gap-3">
							<Switch
								checked={toggles[row.id] ?? true}
								onCheckedChange={(value) =>
									setToggles((current) => ({
										...current,
										[row.id]: value,
									}))
								}
							/>
							<span className="text-sm text-slate-800">
								<Translate
									text={
										localizationConstants.moduleSettingActivated
									}
								/>
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UsersSettingsTab;
