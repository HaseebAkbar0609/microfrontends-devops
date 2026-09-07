"use client";

import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SUPPORT_CRAFTSMEN_SEED } from "../../constants/supportCraftsmen.mock";
import { NO_SELECTION } from "../../schemas/supportTicket.schema";
import type { SupportTicketFormValues } from "../../schemas/supportTicket.schema";
import { CraftsmanStatusBadge } from "../SupportBadges";

type CraftsmanPickerProps = {
	control: Control<SupportTicketFormValues>;
};

/**
 * Shown only for craftsman customers. The prototype rendered a select *and* a
 * card grid for the same value; the cards alone are clearer and stay keyboard
 * reachable because each one is a real button.
 */
export function CraftsmanPicker({ control }: CraftsmanPickerProps) {
	const { field } = useController({ control, name: "craftsmanId" });

	return (
		<fieldset className="mt-4">
			<legend className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.supportFieldCraftsman} />
			</legend>
			<div className="mt-3 grid gap-2.5 @2xl:grid-cols-2">
				<button
					type="button"
					aria-pressed={field.value === NO_SELECTION}
					onClick={() => field.onChange(NO_SELECTION)}
					className={`cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors ${
						field.value === NO_SELECTION
							? "border-slate-900 bg-slate-50"
							: "border-slate-200 hover:bg-slate-50"
					}`}
				>
					<span className="font-medium text-slate-900">
						<Translate
							text={localizationConstants.supportSelectCraftsmanPlaceholder}
						/>
					</span>
				</button>

				{SUPPORT_CRAFTSMEN_SEED.map((craftsman) => {
					const isActive = field.value === craftsman.id;
					return (
						<button
							key={craftsman.id}
							type="button"
							aria-pressed={isActive}
							onClick={() => field.onChange(craftsman.id)}
							className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
								isActive
									? "border-slate-900 bg-slate-50"
									: "border-slate-200 hover:bg-slate-50"
							}`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-slate-900">
										{craftsman.name}
									</p>
									<p className="truncate text-xs text-slate-500">
										<Translate text={craftsman.tradeKey} /> ·{" "}
										{craftsman.country}
									</p>
								</div>
								<CraftsmanStatusBadge status={craftsman.status} />
							</div>
						</button>
					);
				})}
			</div>
		</fieldset>
	);
}
