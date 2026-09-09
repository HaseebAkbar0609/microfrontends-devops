"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SUPPORT_COUNTRIES } from "../../constants/support.constants";
import { TICKET_PRIORITIES } from "../../constants/supportStatuses";
import { getSlaMinutesForPriority } from "../../utils/ticketFactories";
import { SupportModuleShell } from "../SupportModuleShell";
import { SettingsToggle, SupportSettingsCard } from "./SupportSettingsCard";

export default function SupportSettingsPage() {
	const t = useTranslate();
	const [defaultCountry, setDefaultCountry] = useState<string>(
		SUPPORT_COUNTRIES[0],
	);
	const [openingHours, setOpeningHours] = useState("08:00-17:00");
	const [autoEscalate, setAutoEscalate] = useState(true);
	const [chatEnabled, setChatEnabled] = useState(true);
	const [notifySlaBreach, setNotifySlaBreach] = useState(true);
	const [notifyEveryTicket, setNotifyEveryTicket] = useState(false);

	return (
		<SupportModuleShell>
			<div className="grid gap-5 @4xl:grid-cols-2">
				<SupportSettingsCard
					titleKey={localizationConstants.supportSettingsOrgTitle}
				>
					<div className="space-y-1.5">
						<Label htmlFor="support-default-country">
							<Translate
								text={localizationConstants.supportSettingsDefaultCountry}
							/>
						</Label>
						<Select value={defaultCountry} onValueChange={setDefaultCountry}>
							<SelectTrigger id="support-default-country" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{SUPPORT_COUNTRIES.map((country) => (
									<SelectItem key={country} value={country}>
										{country}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="support-opening-hours">
							<Translate
								text={localizationConstants.supportSettingsOpeningHours}
							/>
						</Label>
						<Input
							id="support-opening-hours"
							value={openingHours}
							onChange={(event) => setOpeningHours(event.target.value)}
						/>
					</div>
				</SupportSettingsCard>

				<SupportSettingsCard
					titleKey={localizationConstants.supportSettingsSlaTitle}
				>
					<ul className="space-y-2">
						{TICKET_PRIORITIES.map((priority) => (
							<li
								key={priority.id}
								className="flex items-center justify-between gap-3 text-sm"
							>
								<span className="text-slate-700">
									<Translate text={priority.labelKey} />
								</span>
								<span className="tabular-nums text-slate-500">
									{getSlaMinutesForPriority(priority.id)}{" "}
									<Translate
										text={localizationConstants.supportSettingsMinutesSuffix}
									/>
								</span>
							</li>
						))}
					</ul>
					<SettingsToggle
						labelKey={localizationConstants.supportSettingsAutoEscalate}
						hintKey={localizationConstants.supportSettingsAutoEscalateHint}
						checked={autoEscalate}
						onCheckedChange={setAutoEscalate}
					/>
				</SupportSettingsCard>

				<SupportSettingsCard
					titleKey={localizationConstants.supportSettingsChannelsTitle}
				>
					<SettingsToggle
						labelKey={localizationConstants.supportSettingsChatInSystem}
						checked={chatEnabled}
						onCheckedChange={setChatEnabled}
					/>
				</SupportSettingsCard>

				<SupportSettingsCard
					titleKey={localizationConstants.supportSettingsNotificationsTitle}
				>
					<SettingsToggle
						labelKey={localizationConstants.supportSettingsSlaBreach}
						hintKey={localizationConstants.supportSettingsSlaBreachHint}
						checked={notifySlaBreach}
						onCheckedChange={setNotifySlaBreach}
					/>
					<SettingsToggle
						labelKey={localizationConstants.supportSettingsEveryNewTicket}
						hintKey={localizationConstants.supportSettingsEveryNewTicketHint}
						checked={notifyEveryTicket}
						onCheckedChange={setNotifyEveryTicket}
					/>
				</SupportSettingsCard>
			</div>

			<div>
				<Button
					type="button"
					className="cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
					onClick={() =>
						showToast(
							"success",
							t(localizationConstants.supportSettingsSavedToast),
						)
					}
				>
					<Translate text={localizationConstants.supportSettingsSaveButton} />
				</Button>
			</div>
		</SupportModuleShell>
	);
}
