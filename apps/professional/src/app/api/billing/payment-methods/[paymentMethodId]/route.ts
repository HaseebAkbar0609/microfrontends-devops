import { deletePaymentMethod } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

const paymentMethodIdPattern = /^pm_[A-Za-z0-9_]+$/;

export async function DELETE(
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
		await deletePaymentMethod(
			{ authorization, companyId },
			paymentMethodId,
		);
		return NextResponse.json({ deleted: true });
	} catch (error) {
		console.error(
			"Payment method deletion failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		const status =
			typeof error === "object" &&
			error !== null &&
			"status" in error &&
			error.status === 409
				? 409
				: 502;
		return NextResponse.json(
			{ message: status === 409 ? "Last payment method cannot be deleted" : "Unable to delete payment method" },
			{ status },
		);
	}
}
