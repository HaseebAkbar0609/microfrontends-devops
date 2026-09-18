import { RegisterPage } from "@/features/tools/register/components/RegisterPage";

export const dynamic = "force-dynamic";

export default function CustomerRegisterPage() {
	return <RegisterPage defaultRegister="kund" />;
}
