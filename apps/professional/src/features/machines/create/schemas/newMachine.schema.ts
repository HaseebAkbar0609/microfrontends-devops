import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

/**
 * Every field on the MaskinInformation card is required before the machine can
 * be saved; the instruction text is optional. Messages are translation keys so
 * FormInput/FormSelect can run them through `Translate`.
 */
export const newMachineSchema = z.object({
	machineNo: z.string(),
	name: z.string().min(1, localizationConstants.machineCreateFieldRequired),
	factory: z.string().min(1, localizationConstants.machineCreateFieldRequired),
	designation: z
		.string()
		.min(1, localizationConstants.machineCreateFieldRequired),
	category: z.string().min(1, localizationConstants.machineCreateFieldRequired),
	purchaseDate: z
		.string()
		.min(1, localizationConstants.machineCreateFieldRequired),
	internalRent: z
		.string()
		.min(1, localizationConstants.machineCreateFieldRequired),
	unit: z.string().min(1, localizationConstants.machineCreateFieldRequired),
	location: z.string().min(1, localizationConstants.machineCreateFieldRequired),
	/** Optional in practice: the form always supplies a string, empty is valid. */
	instruction: z.string(),
});

export type NewMachineSchema = z.infer<typeof newMachineSchema>;

/** Fields validated before the wizard advances past the Information step. */
export const INFORMATION_STEP_FIELDS = [
	"name",
	"factory",
	"designation",
	"category",
	"purchaseDate",
	"internalRent",
	"unit",
	"location",
] as const;
