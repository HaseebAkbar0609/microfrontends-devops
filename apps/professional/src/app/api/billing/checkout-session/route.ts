import { createHostedCheckout } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
	planCode: z.string().regex(/^[a-z0-9_-]+$/),
	billingInterval: z.enum(["monthly", "annual"]),
	quantity: z.number().int().min(1).max(1000),
	requestId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ message: "Invalid checkout request" }, { status: 400 });
	}

	try {
		const result = await createHostedCheckout(
			{ authorization, companyId },
			parsed.data,
		);
		return NextResponse.json(result);
	} catch (error) {
		console.error(
			"Hosted checkout failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to start checkout" },
			{ status: 502 },
		);
	}
}
