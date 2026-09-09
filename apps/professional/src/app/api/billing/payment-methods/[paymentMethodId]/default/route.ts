import { setDefaultPaymentMethod } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

const paymentMethodIdPattern = /^pm_[A-Za-z0-9_]+$/;

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ paymentMethodId: string }> },
) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { paymentMethodId } = await context.params;
	if (!paymentMethodIdPattern.test(paymentMethodId) || paymentMethodId.length > 255) {
		return NextResponse.json({ message: "Invalid payment method id" }, { status: 400 });
	}

	try {
		return NextResponse.json(
			await setDefaultPaymentMethod(
				{ authorization, companyId },
				paymentMethodId,
			),
		);
	} catch (error) {
		console.error(
			"Default payment method update failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to update default payment method" },
			{ status: 502 },
		);
	}
}
