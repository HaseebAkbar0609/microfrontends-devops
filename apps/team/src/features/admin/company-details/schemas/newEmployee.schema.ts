import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import {
	EMPLOYEE_STATUS_CONFIG,
	EMPLOYMENT_TYPE_LABEL,
	ID_NUMBER_PATTERN,
	type EmployeeStatus,
	type EmploymentType,
} from "../constants/organisation";

const STATUSES = Object.keys(EMPLOYEE_STATUS_CONFIG) as [EmployeeStatus, ...EmployeeStatus[]];
const TYPES = Object.keys(EMPLOYMENT_TYPE_LABEL) as [EmploymentType, ...EmploymentType[]];

/**
 * A new row in the organisation table. Messages are translation keys; the
 * form fields translate them, so the language toggle applies.
 */
export const newEmployeeSchema = z.object({
	name: z.string().trim().min(1, localizationConstants.adminEmployeeNameRequired),
	position: z.string().trim().min(1, localizationConstants.adminEmployeePositionRequired),
	idNumber: z
		.string()
		.trim()
		.refine(
			(value) => value === "" || ID_NUMBER_PATTERN.test(value),
			localizationConstants.adminEmployeeIdNumberInvalid,
		),
	status: z.enum(STATUSES),
	type: z.enum(TYPES),
	startDate: z.string().min(1, localizationConstants.adminEmployeeStartDateRequired),
	location: z.string().trim(),
});

export type NewEmployeeValues = z.infer<typeof newEmployeeSchema>;

export const EMPTY_NEW_EMPLOYEE: NewEmployeeValues = {
	name: "",
	position: "",
	idNumber: "",
	status: "active",
	type: "full-time",
	startDate: "",
	location: "",
};
