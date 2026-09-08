"use client";

import { Mail, Save } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { NewsletterFormValues } from "../../schemas/newsletter.schema";

type NewsletterComposerCardProps = {
	form: UseFormReturn<NewsletterFormValues>;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	onOpenInMail: () => void;
};

/**
 * Heading, body and owner.
 *
 * The body is a real field here: the prototype read it into state, left it out
 * of the saved row, cleared it, and still reported success.
 */
export function NewsletterComposerCard({
	form,
	onSubmit,
	onOpenInMail,
}: NewsletterComposerCardProps) {
	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.marketingComposerTitle} />
			</h2>

			<Form {...form}>
				<form onSubmit={onSubmit} className="mt-3 flex flex-col gap-4">
					<FormInput
						control={form.control}
						name="heading"
						label={localizationConstants.marketingFieldHeading}
						placeholder={localizationConstants.marketingHeadingPlaceholder}
					/>
					<FormTextarea
						control={form.control}
						name="body"
						label={localizationConstants.marketingFieldBody}
						placeholder={localizationConstants.marketingBodyPlaceholder}
						rows={6}
					/>
					<FormInput
						control={form.control}
						name="owner"
						label={localizationConstants.marketingFieldResponsible}
						placeholder={localizationConstants.marketingOwnerPlaceholder}
					/>

					<div className="flex flex-wrap gap-2">
						<Button type="submit" className="cursor-pointer">
							<Save className="size-4" aria-hidden />
							<Translate text={localizationConstants.marketingSaveDraftButton} />
						</Button>
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer"
							onClick={onOpenInMail}
						>
							<Mail className="size-4" aria-hidden />
							<Translate
								text={localizationConstants.marketingOpenInMailButton}
							/>
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}

export default NewsletterComposerCard;
