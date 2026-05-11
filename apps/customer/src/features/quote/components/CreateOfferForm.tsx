import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { FormSelectOption } from "@/components/form";
import { CreateOfferFormValues } from "../types/form";
import { Step1PersonalInformation } from "./steps/PersonalInformation";
import { Step2ProjectInformation } from "./steps/ProjectInformation";
import { Step3ProjectDescription } from "./steps/ProjectDescription";
import { Step4InviteSupplier } from "./steps/InviteSupplier";
import { OfferOverview } from "./steps/OfferOverview";

interface CreateOfferFormProps {
	form: UseFormReturn<CreateOfferFormValues>;
	step: number;
	categoryOptions: FormSelectOption[];
	categoriesLoading: boolean;
	categoryHasMore?: boolean;
	categoryLoadingMore?: boolean;
	onCategoryLoadMore?: () => void | Promise<void>;
	onCategorySearchChange?: (query: string) => void | Promise<void>;
}

/** Wizard body; validation timing is set on `useForm` in `CreateOfferPage` (`onSubmit` / `onBlur`). */
export function CreateOfferForm({
	form,
	step,
	categoryOptions,
	categoriesLoading,
	categoryHasMore = false,
	categoryLoadingMore = false,
	onCategoryLoadMore,
	onCategorySearchChange,
}: CreateOfferFormProps) {
	const countryId = form.watch("country");

	return (
		<Form {...form}>
			<div className="space-y-4">
				{step === 1 && <Step1PersonalInformation form={form} countryId={countryId} />}
				{step === 2 && (
					<Step2ProjectInformation
						form={form}
						countryId={countryId}
						categoryOptions={categoryOptions}
						categoriesLoading={categoriesLoading}
						categoryHasMore={categoryHasMore}
						categoryLoadingMore={categoryLoadingMore}
						onCategoryLoadMore={onCategoryLoadMore}
						onCategorySearchChange={onCategorySearchChange}
					/>
				)}
				{step === 3 && <Step3ProjectDescription form={form} />}
				{step === 4 && <Step4InviteSupplier form={form} />}
				{step === 5 && (
					<OfferOverview
						form={form}
						categoryOptions={categoryOptions}
					/>
				)}
			</div>
		</Form>
	);
}
