import { getHostedCheckoutStatus } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

const checkoutSessionIdPattern = /^cs_[A-Za-z0-9_]+$/;

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ sessionId: string }> },
) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { sessionId } = await context.params;
	if (!checkoutSessionIdPattern.test(sessionId) || sessionId.length > 255) {
		return NextResponse.json(
			{ message: "Invalid Checkout Session id" },
			{ status: 400 },
		);
	}

	try {
		return NextResponse.json(
			await getHostedCheckoutStatus({ authorization, companyId }, sessionId),
		);
	} catch (error) {
		console.error(
			"Hosted checkout status failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to verify checkout" },
			{ status: 502 },
		);
	}
}
