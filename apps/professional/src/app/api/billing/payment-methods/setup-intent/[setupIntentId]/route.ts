import { completePaymentMethodSetup } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

const setupIntentIdPattern = /^seti_[A-Za-z0-9_]+$/;

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ setupIntentId: string }> },
) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { setupIntentId } = await context.params;
	if (!setupIntentIdPattern.test(setupIntentId) || setupIntentId.length > 255) {
		return NextResponse.json({ message: "Invalid SetupIntent id" }, { status: 400 });
	}

	try {
		return NextResponse.json(
			await completePaymentMethodSetup(
				{ authorization, companyId },
				setupIntentId,
			),
		);
	} catch (error) {
		console.error(
			"Payment method completion failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to save payment method" },
			{ status: 502 },
		);
	}
}
