import { redirect } from "next/navigation";
import { ECONOMY_ROT_RUT_BASE_URL } from "@/features/financial-management/constants/economyNav.config";

export default function RotRutRedirectPage() {
	redirect(ECONOMY_ROT_RUT_BASE_URL);
}

