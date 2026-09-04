import { redirect } from "next/navigation";

export default function OrderRootPage() {
	redirect("/module/production/order/dashboard");
}
