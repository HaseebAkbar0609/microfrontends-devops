import { createPaymentMethodSetup } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
	email: z.string().email().max(320),
});

export async function POST(request: NextRequest) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ message: "Invalid email" }, { status: 400 });
	}

	try {
		return NextResponse.json(
			await createPaymentMethodSetup(
				{ authorization, companyId },
				parsed.data.email,
			),
		);
	} catch (error) {
		console.error(
			"Payment method setup failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to start payment method setup" },
			{ status: 502 },
		);
	}
}
