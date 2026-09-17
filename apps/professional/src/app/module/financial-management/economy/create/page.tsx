import { redirect } from "next/navigation";
import { CREATE_EXPENSE_ROUTE } from "@/features/financial-management/constants/expense.constants";

export default function CreateExpensePage() {
	redirect(CREATE_EXPENSE_ROUTE);
}
