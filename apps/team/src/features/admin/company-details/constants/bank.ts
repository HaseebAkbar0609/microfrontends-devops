import type { BankInformationFormValues } from "../schemas/bankInformation.schema";

export const DEFAULT_BANK_VALUES: BankInformationFormValues = {
	bank: "Swedbank",
	accountNumber: "123 563 633",
	bankgiro: "5663-2500",
	postgiro: "1256045-7",
	iban: "5626894568",
	bic: "SE87009SDB8",
	swift: "",
};
