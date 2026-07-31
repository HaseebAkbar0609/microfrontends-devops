import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export interface EmploymentContract {
	employeeName: string;
	role: string;
	employmentNumber: string;
	personNumber: string;
	startDate: string;
	address: string;
	postalCode: string;
	city: string;
	mobile: string;
	email: string;
	documentPages: string[];
}

const CONTRACT_PAGE_TEXT =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna. Integer nulla. Donec blandit feugiat ligula. Donec hendrerit, felis et imperdiet euismod, purus ipsum pretium metus, in lacinia nulla nisl eget sapien.\n\nDonec ut est in lectus consequat consequat. Etiam eget dui. Aliquam erat volutpat. Sed at lorem in nunc porta tristique. Proin nec augue. Quisque aliquam tempor magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc ac magna. Maecenas odio dolor, vulputate vel, auctor ac, accumsan id, felis. Pellentesque cursus sagittis felis. Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros.\n\nIn in nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Donec ullamcorper fringilla eros. Fusce in sapien eu purus dapibus commodo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras faucibus condimentum odio. Sed ac ligula. Aliquam at eros. Etiam at ligula et tellus ullamcorper ultrices. In fermentum, lorem non cursus porttitor, diam urna accumsan lacus, sed interdum wisi nibh nec nisl.\n\nQuisque ornare placerat risus. Ut molestie magna at mi. Integer aliquet mauris et nibh. Ut mattis ligula posuere velit. Nunc sagittis. Curabitur varius fringilla nisl. Duis pretium mi euismod erat. Maecenas id augue. Nam vulputate. Duis a quam non neque lobortis malesuada. Praesent euismod. Donec nulla augue, venenatis scelerisque, dapibus a, consequat at, leo.";

export const EMPLOYMENT_CONTRACT: EmploymentContract = {
	employeeName: "Anna Andersson",
	role: "Snickare",
	employmentNumber: "00001",
	personNumber: "000000-0000",
	startDate: mockDate(-611),
	address: "Mysgränd 14, 113 45 STOCKHOLM",
	postalCode: "-",
	city: "Järfälla",
	mobile: "-",
	email: "Ann@example.com",
	documentPages: [CONTRACT_PAGE_TEXT, CONTRACT_PAGE_TEXT],
};

export const EMPLOYMENT_TAB_IDS = [
	"contract",
	"sickReport",
	"leave",
	"payslip",
	"documents",
] as const;

export type EmploymentTabId = (typeof EMPLOYMENT_TAB_IDS)[number];

export const EMPLOYMENT_TABS: { id: EmploymentTabId; label: string }[] = [
	{ id: "contract", label: localizationConstants.myPagesEmpTabContract },
	{ id: "sickReport", label: localizationConstants.myPagesEmpTabSickReport },
	{ id: "leave", label: localizationConstants.myPagesEmpTabLeave },
	{ id: "payslip", label: localizationConstants.myPagesEmpTabPayslip },
	{ id: "documents", label: localizationConstants.myPagesEmpTabDocuments },
];
