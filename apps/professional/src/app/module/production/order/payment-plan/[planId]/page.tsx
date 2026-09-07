import { redirect } from "next/navigation";
import { ORDER_MODULE_BASE_URL } from "@/features/orders/data/orderNav.config";

export default function OrderPaymentPlanDetailRootPageRoute() {
	redirect(`${ORDER_MODULE_BASE_URL}/overview`);
}
