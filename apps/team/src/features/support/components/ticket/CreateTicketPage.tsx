"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/form";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SUPPORT_MODULE_HREF,
	SUPPORT_MODULE_TABS,
	SUPPORT_MODULE_TITLE_KEY,
} from "../../constants/supportNav";
import { useCreateTicketForm } from "../../hooks/useCreateTicketForm";
import { CraftsmanPicker } from "./CraftsmanPicker";
import { CreateTicketFields } from "./CreateTicketFields";

export default function CreateTicketPage() {
	const { form, submit, availableAgents, customerType } =
		useCreateTicketForm();

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SUPPORT_MODULE_TITLE_KEY}
				tabs={SUPPORT_MODULE_TABS}
				record={{
					title: (
						<Translate
							text={localizationConstants.supportCreateTicketTitle}
						/>
					),
					backHref: SUPPORT_MODULE_HREF,
				}}
			/>

			<div className="px-5 py-5">
				<Form {...form}>
					<form
						onSubmit={submit}
						className="@container mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
					>
						<p className="mb-4 text-sm text-slate-500">
							<Translate
								text={localizationConstants.supportCreateTicketDescription}
							/>
						</p>

						<CreateTicketFields
							control={form.control}
							availableAgents={availableAgents}
						/>

						{customerType === "craftsman" ? (
							<CraftsmanPicker control={form.control} />
						) : null}

						<div className="mt-5 flex flex-wrap justify-end gap-2">
							<Button
								asChild
								type="button"
								variant="outline"
								className="cursor-pointer"
							>
								<Link href={SUPPORT_MODULE_HREF}>
									<Translate text={localizationConstants.supportCancelButton} />
								</Link>
							</Button>
							<Button
								type="submit"
								className="cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
							>
								<Translate
									text={localizationConstants.supportCreateTicketButton}
								/>
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
